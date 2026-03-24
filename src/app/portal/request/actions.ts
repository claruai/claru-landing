"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPostHogServer } from "@/lib/posthog-server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RequestFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const VALID_MODALITIES = [
  "Video",
  "Image",
  "Text",
  "Audio",
  "Multi-modal",
  "Other",
] as const;

// ---------------------------------------------------------------------------
// Server Action: submitCustomRequest
// ---------------------------------------------------------------------------

export async function submitCustomRequest(
  _prevState: RequestFormState,
  formData: FormData
): Promise<RequestFormState> {
  const description = formData.get("description") as string | null;
  const modality = formData.get("modality") as string | null;
  const notes = formData.get("notes") as string | null;

  // --- Validation -----------------------------------------------------------

  if (!description || description.trim().length === 0) {
    return {
      status: "error",
      message: "Please describe the data you need.",
    };
  }

  if (description.trim().length > 5000) {
    return {
      status: "error",
      message: "Description must be under 5,000 characters.",
    };
  }

  if (
    modality &&
    !VALID_MODALITIES.includes(modality as (typeof VALID_MODALITIES)[number])
  ) {
    return {
      status: "error",
      message: "Invalid modality selection.",
    };
  }

  if (notes && notes.trim().length > 2000) {
    return {
      status: "error",
      message: "Notes must be under 2,000 characters.",
    };
  }

  // --- Auth check -----------------------------------------------------------

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "You must be signed in to submit a request.",
    };
  }

  // --- Get lead_id from supabase_user_id ------------------------------------

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("supabase_user_id", user.id)
    .single();

  if (leadError || !lead) {
    return {
      status: "error",
      message: "Could not find your account. Please contact support.",
    };
  }

  // --- Insert into custom_requests ------------------------------------------

  const { error: insertError } = await supabase
    .from("custom_requests")
    .insert({
      lead_id: lead.id,
      description: description.trim(),
      data_modality: modality || null,
      notes: notes?.trim() || null,
    });

  if (insertError) {
    console.error("custom_requests insert failed:", insertError);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // Track server-side (distinctId = email to match client-side identify)
  const ph = getPostHogServer();
  ph?.capture({
    distinctId: user.email ?? user.id,
    event: "custom_request_submitted",
    properties: {
      lead_id: lead.id,
      modality: modality || null,
      description_length: description.trim().length,
    },
  });

  return {
    status: "success",
    message: "Request submitted. Our team will review it and reach out.",
  };
}
