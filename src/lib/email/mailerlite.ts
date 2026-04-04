const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";

/**
 * Subscribe an email to the waitlist group in MailerLite.
 * Best-effort — failures are logged but never thrown.
 */
export function subscribeToWaitlist(email: string, country: string): void {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.warn("[mailerlite] MAILERLITE_API_KEY not set, skipping subscriber sync");
    return;
  }

  const groupId = process.env.MAILERLITE_GROUP_ID;

  fetch(`${MAILERLITE_API_URL}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      fields: { country },
      ...(groupId ? { groups: [groupId] } : {}),
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const body = await response.text();
        console.error(`[mailerlite] Failed to subscribe: ${response.status} ${body}`);
      }
    })
    .catch((error) => {
      console.error("[mailerlite] Network error subscribing to waitlist:", error);
    });
}
