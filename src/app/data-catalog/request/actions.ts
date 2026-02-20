'use server';

import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { sendAdminNotification } from '@/lib/email';

// ---------------------------------------------------------------------------
// Validation Schema
// ---------------------------------------------------------------------------

const accessRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string(),
  role: z.string(),
  data_needs: z.string(),
  use_case: z.string().min(1, 'Please select a use case'),
});

export type AccessRequestInput = z.infer<typeof accessRequestSchema>;

export type AccessRequestResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

export async function submitAccessRequest(
  formData: AccessRequestInput
): Promise<AccessRequestResult> {
  // 1. Validate input with Zod
  const parsed = accessRequestSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? 'Invalid form data',
    };
  }

  const { name, email, company, role, data_needs, use_case } = parsed.data;

  try {
    const supabase = createSupabaseAdminClient();

    // 2. Upsert into leads table
    //    If email already exists, update the existing lead and reset status
    //    to pending if it was previously rejected.
    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          name,
          email,
          company,
          role,
          data_needs,
          use_case,
          status: 'pending',
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      );

    if (error) {
      console.error('[submitAccessRequest] Supabase insert error:', error);
      return {
        success: false,
        error: 'Something went wrong submitting your request. Please try again.',
      };
    }

    // 3. Fire-and-forget: send admin notification email
    sendAdminNotification({ name, email, company, role, data_needs, use_case }).catch(
      (err) => console.error('[submitAccessRequest] Email notification failed:', err)
    );

    // 4. Return success
    return {
      success: true,
      message: 'Your request has been submitted. We\'ll review it and get back to you within 24 hours.',
    };
  } catch (err) {
    console.error('[submitAccessRequest] Unexpected error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
