// Fires a single "lead" conversion event to whichever tracking tools are
// configured (see components/Analytics.js). Each call is a no-op if that
// tool isn't loaded, so this is always safe to call.
export function trackLead({ email } = {}) {
  if (typeof window === "undefined") return;

  // GA4 / any other tag configured in GTM to listen for this event.
  window.dataLayer?.push({ event: "generate_lead", email });

  // Meta Pixel
  window.fbq?.("track", "Lead");

  // TikTok Pixel
  window.ttq?.track("SubmitForm");

  // PostHog
  window.posthog?.capture("lead_submitted", { email });
}
