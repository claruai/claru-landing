export const APP_URLS = {
  signIn: "https://app.claru.ai/auth/signin",
  signUp: "https://app.claru.ai/signup",
} as const;

// Calendly embed theme params matching --accent-primary (#92B090).
// Appended to the booking URL when rendering the inline Calendly iframe.
export const CALENDLY_THEME_PARAMS =
  "background_color=0a0908&text_color=e8e8e8&primary_color=92B090&hide_gdpr_banner=1";

// Fallback booking URL used when the database setting isn't configured yet.
export const DEFAULT_BOOKING_URL = "https://calendly.com/claru-ai/30min";

/** Append Calendly theme params to a base booking URL for iframe embedding. */
export function buildCalendlyEmbedUrl(
  baseUrl: string,
  prefill?: { name?: string; email?: string }
): string {
  const separator = baseUrl.includes("?") ? "&" : "?";
  let url = `${baseUrl}${separator}${CALENDLY_THEME_PARAMS}`;
  if (prefill?.name) url += `&name=${encodeURIComponent(prefill.name)}`;
  if (prefill?.email) url += `&email=${encodeURIComponent(prefill.email)}`;
  return url;
}
