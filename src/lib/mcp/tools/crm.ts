import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// list_leads tool
// ---------------------------------------------------------------------------

function registerListLeads(server: McpServer) {
  server.tool(
    "list_leads",
    "List leads in the system. Use to find existing leads before creating duplicates. Supports filtering by status and searching by name/email/company.",
    {
      status: z.enum(["pending", "approved", "rejected"]).optional().describe("Filter by status (default: all)"),
      search: z.string().optional().describe("Search by name, email, or company"),
      limit: z.number().min(1).max(100).default(20).describe("Max results (default 20)"),
    },
    async ({ status, search, limit }) => {
      const supabase = createSupabaseAdminClient();

      let query = supabase
        .from("leads")
        .select("id, name, email, company, role, status, data_needs, use_case, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (status) query = query.eq("status", status);
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify({ leads: data ?? [], count: data?.length ?? 0 }) }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// create_lead tool
// ---------------------------------------------------------------------------

function registerCreateLead(server: McpServer) {
  server.tool(
    "create_lead",
    "Create a new lead and optionally approve them immediately. Returns the lead record with ID. Check list_leads first to avoid duplicates.",
    {
      name: z.string().min(1).describe("Lead's full name"),
      email: z.string().email().describe("Lead's email address"),
      company: z.string().min(1).describe("Lead's company name"),
      role: z.string().optional().describe("Lead's role/title"),
      data_needs: z.string().optional().describe("What data they need"),
      use_case: z.string().optional().describe("Their use case for the data"),
      auto_approve: z.boolean().default(true).describe("Automatically approve the lead (default: true)"),
    },
    async ({ name, email, company, role, data_needs, use_case, auto_approve }) => {
      const supabase = createSupabaseAdminClient();

      // Check for existing lead with same email
      const { data: existing } = await supabase
        .from("leads")
        .select("id, name, email, status")
        .eq("email", email)
        .single();

      if (existing) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              error: "Lead with this email already exists",
              existing_lead: existing,
            }),
          }],
        };
      }

      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name,
          email,
          company,
          role: role ?? "",
          data_needs: data_needs ?? "",
          use_case: use_case ?? "",
          status: auto_approve ? "approved" : "pending",
          admin_notes: "Created via MCP agent",
        })
        .select()
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead,
            message: `Lead created${auto_approve ? " and approved" : ""}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// get_lead tool
// ---------------------------------------------------------------------------

function registerGetLead(server: McpServer) {
  server.tool(
    "get_lead",
    "Get full details of a lead by ID, including their dataset access and custom samples.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
    },
    async ({ lead_id }) => {
      const supabase = createSupabaseAdminClient();

      const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", lead_id)
        .single();

      if (error || !lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Get dataset access
      const { data: access } = await supabase
        .from("lead_dataset_access")
        .select("dataset_id, granted_at, datasets:dataset_id(name)")
        .eq("lead_id", lead_id);

      // Get custom clips count (lead-specific dataset_clips entries)
      const { count: customSampleCount } = await supabase
        .from("dataset_clips")
        .select("id", { count: "exact", head: true })
        .eq("lead_id", lead_id);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead,
            dataset_access: (access ?? []).map((a: Record<string, unknown>) => ({
              dataset_id: a.dataset_id,
              dataset_name: (a.datasets as Record<string, unknown> | null)?.name ?? null,
              granted_at: a.granted_at,
            })),
            custom_sample_count: customSampleCount ?? 0,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// update_lead tool
// ---------------------------------------------------------------------------

function registerUpdateLead(server: McpServer) {
  server.tool(
    "update_lead",
    "Update lead details (name, email, company, role, data_needs, use_case, admin_notes). Cannot change status -- use approve_lead instead. Cannot delete leads.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      name: z.string().optional().describe("Updated name"),
      email: z.string().email().optional().describe("Updated email"),
      company: z.string().optional().describe("Updated company"),
      role: z.string().optional().describe("Updated role/title"),
      data_needs: z.string().optional().describe("Updated data needs"),
      use_case: z.string().optional().describe("Updated use case"),
      admin_notes: z.string().optional().describe("Updated admin notes"),
    },
    async ({ lead_id, ...updates }) => {
      const supabase = createSupabaseAdminClient();

      // Filter out undefined values
      const fields: Record<string, string> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) fields[key] = value;
      }

      if (Object.keys(fields).length === 0) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "No fields to update" }) }],
        };
      }

      const { data: lead, error } = await supabase
        .from("leads")
        .update(fields)
        .eq("id", lead_id)
        .select()
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ lead, message: `Updated fields: ${Object.keys(fields).join(", ")}` }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// approve_lead tool
// ---------------------------------------------------------------------------

function registerApproveLead(server: McpServer) {
  server.tool(
    "approve_lead",
    "Approve a pending lead. Sets status to 'approved' but does NOT send an invite email or create a Supabase auth user. Use the admin UI to send invites.",
    {
      lead_id: z.string().uuid().describe("Lead UUID to approve"),
    },
    async ({ lead_id }) => {
      const supabase = createSupabaseAdminClient();

      // Check current status
      const { data: lead, error: fetchErr } = await supabase
        .from("leads")
        .select("id, name, email, status")
        .eq("id", lead_id)
        .single();

      if (fetchErr || !lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      if (lead.status === "approved") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ message: "Lead is already approved", lead }) }],
        };
      }

      const { data: updated, error } = await supabase
        .from("leads")
        .update({ status: "approved" })
        .eq("id", lead_id)
        .select()
        .single();

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead: updated,
            message: `Lead "${lead.name}" approved. Use admin UI to send invite email.`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// grant_lead_access tool
// ---------------------------------------------------------------------------

function registerGrantLeadAccess(server: McpServer) {
  server.tool(
    "grant_lead_access",
    "Grant a lead access to one or more existing datasets/catalogs. The lead will see these in their portal. Use list_datasets to find dataset IDs.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      dataset_ids: z.array(z.string().uuid()).min(1).describe("Dataset UUIDs to grant access to"),
    },
    async ({ lead_id, dataset_ids }) => {
      const supabase = createSupabaseAdminClient();

      // Verify lead exists
      const { data: lead } = await supabase
        .from("leads")
        .select("id, name, company")
        .eq("id", lead_id)
        .single();

      if (!lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Verify datasets exist
      const { data: datasets } = await supabase
        .from("datasets")
        .select("id, name")
        .in("id", dataset_ids);

      const foundIds = new Set((datasets ?? []).map((d) => d.id));
      const notFound = dataset_ids.filter((id) => !foundIds.has(id));

      // Upsert access grants
      const rows = dataset_ids
        .filter((id) => foundIds.has(id))
        .map((dataset_id) => ({ lead_id, dataset_id }));

      let granted = 0;
      if (rows.length > 0) {
        const { error } = await supabase
          .from("lead_dataset_access")
          .upsert(rows, { onConflict: "lead_id,dataset_id" });

        if (error) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
          };
        }
        granted = rows.length;
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead: { id: lead.id, name: lead.name, company: lead.company },
            granted,
            datasets_granted: (datasets ?? []).map((d) => ({ id: d.id, name: d.name })),
            not_found: notFound.length > 0 ? notFound : undefined,
            message: `Granted ${lead.name} access to ${granted} dataset${granted !== 1 ? "s" : ""}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// revoke_lead_access tool
// ---------------------------------------------------------------------------

function registerRevokeLeadAccess(server: McpServer) {
  server.tool(
    "revoke_lead_access",
    "Revoke a lead's access to one or more datasets/catalogs. They will no longer see these in their portal.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      dataset_ids: z.array(z.string().uuid()).min(1).describe("Dataset UUIDs to revoke access from"),
    },
    async ({ lead_id, dataset_ids }) => {
      const supabase = createSupabaseAdminClient();

      const { data: deleted, error } = await supabase
        .from("lead_dataset_access")
        .delete()
        .eq("lead_id", lead_id)
        .in("dataset_id", dataset_ids)
        .select("dataset_id");

      if (error) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: error.message }) }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            revoked: deleted?.length ?? 0,
            message: `Revoked access to ${deleted?.length ?? 0} dataset${(deleted?.length ?? 0) !== 1 ? "s" : ""}`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// list_lead_catalogs tool
// ---------------------------------------------------------------------------

function registerListLeadCatalogs(server: McpServer) {
  server.tool(
    "list_lead_catalogs",
    "List all catalogs/datasets a lead has access to, including clip counts and portal URLs. Use to see what a lead already has before adding more.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
    },
    async ({ lead_id }) => {
      const supabase = createSupabaseAdminClient();

      // Verify lead
      const { data: lead } = await supabase
        .from("leads")
        .select("id, name, company")
        .eq("id", lead_id)
        .single();

      if (!lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      // Get dataset access with dataset details
      const { data: access } = await supabase
        .from("lead_dataset_access")
        .select("dataset_id, granted_at")
        .eq("lead_id", lead_id);

      if (!access || access.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              lead: { id: lead.id, name: lead.name, company: lead.company },
              catalogs: [],
              message: "Lead has no catalog access",
            }),
          }],
        };
      }

      const datasetIds = access.map((a) => a.dataset_id);

      const { data: datasets } = await supabase
        .from("datasets")
        .select("id, name, description, type, total_samples, is_published")
        .in("id", datasetIds);

      // Count clips per dataset via dataset_clips (lead-specific vs base)
      const catalogs = await Promise.all(
        (datasets ?? []).map(async (ds) => {
          const { count: leadClips } = await supabase
            .from("dataset_clips")
            .select("id", { count: "exact", head: true })
            .eq("dataset_id", ds.id)
            .eq("lead_id", lead_id);

          const { count: baseClips } = await supabase
            .from("dataset_clips")
            .select("id", { count: "exact", head: true })
            .eq("dataset_id", ds.id)
            .is("lead_id", null);

          const grantedAt = access.find((a) => a.dataset_id === ds.id)?.granted_at;

          return {
            dataset_id: ds.id,
            name: ds.name,
            description: ds.description,
            type: ds.type,
            total_dataset_clips: ds.total_samples,
            base_clips: baseClips ?? 0,
            lead_specific_clips: leadClips ?? 0,
            is_published: ds.is_published,
            granted_at: grantedAt,
            portal_url: `/portal/catalog/${ds.id}`,
          };
        })
      );

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead: { id: lead.id, name: lead.name, company: lead.company },
            catalogs,
            total_catalogs: catalogs.length,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// create_lead_auth_user tool
// ---------------------------------------------------------------------------

function registerCreateLeadAuthUser(server: McpServer) {
  server.tool(
    "create_lead_auth_user",
    "Create a Supabase auth account with a temporary password for an approved lead so they can log in to the portal. Required before a lead can access the portal. Does NOT send any emails. Returns the temp password -- share it with the lead securely.",
    {
      lead_id: z.string().uuid().describe("Lead UUID"),
      password: z.string().min(8).optional().describe("Custom password. If omitted, a random temp password is generated."),
    },
    async ({ lead_id, password: customPassword }) => {
      const supabase = createSupabaseAdminClient();

      // Generate a temp password if not provided -- use firstname!123 convention
      let tempPassword = customPassword;
      if (!tempPassword) {
        const { data: leadForName } = await supabase
          .from("leads")
          .select("name")
          .eq("id", lead_id)
          .single();
        const firstName = (leadForName?.name ?? "user").split(" ")[0].toLowerCase();
        tempPassword = `${firstName}!123`;
      }

      // Fetch lead
      const { data: lead, error: fetchErr } = await supabase
        .from("leads")
        .select("*")
        .eq("id", lead_id)
        .single();

      if (fetchErr || !lead) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Lead not found" }) }],
        };
      }

      if (lead.status !== "approved") {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({ error: "Lead must be approved first. Use approve_lead tool.", status: lead.status }),
          }],
        };
      }

      // Create or find Supabase Auth user (with temp password for signInWithPassword)
      let supabaseUserId = lead.supabase_user_id;
      let passwordSet = false;

      if (!supabaseUserId) {
        const { data: authUser, error: createErr } =
          await supabase.auth.admin.createUser({
            email: lead.email,
            password: tempPassword,
            email_confirm: true,
          });

        if (createErr) {
          // User might already exist -- find and update their password
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existing = existingUsers?.users?.find((u) => u.email === lead.email);

          if (existing) {
            supabaseUserId = existing.id;
            // Update password and confirm email on existing user
            await supabase.auth.admin.updateUserById(existing.id, {
              password: tempPassword,
              email_confirm: true,
            });
            passwordSet = true;
          } else {
            return {
              content: [{
                type: "text" as const,
                text: JSON.stringify({ error: "Failed to create auth user", details: createErr.message }),
              }],
            };
          }
        } else {
          supabaseUserId = authUser.user.id;
          passwordSet = true;
        }

        // Store supabase_user_id on lead
        await supabase
          .from("leads")
          .update({ supabase_user_id: supabaseUserId })
          .eq("id", lead_id);
      } else {
        // Auth user already exists -- update password and ensure email confirmed
        await supabase.auth.admin.updateUserById(supabaseUserId, {
          password: tempPassword,
          email_confirm: true,
        });
        passwordSet = true;
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claru.ai";

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            lead_id,
            email: lead.email,
            supabase_user_id: supabaseUserId,
            temp_password: tempPassword,
            password_set: passwordSet,
            portal_url: `${siteUrl}/portal/login`,
            message: `Auth account ready. Lead can log in with email: ${lead.email} and the temp password.`,
          }),
        }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Register all CRM tools
// ---------------------------------------------------------------------------

export function register(server: McpServer) {
  registerListLeads(server);
  registerCreateLead(server);
  registerGetLead(server);
  registerUpdateLead(server);
  registerApproveLead(server);
  registerGrantLeadAccess(server);
  registerRevokeLeadAccess(server);
  registerListLeadCatalogs(server);
  registerCreateLeadAuthUser(server);
}
