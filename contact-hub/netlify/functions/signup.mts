import type { Config, Context } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const allowedInterests = new Set([
  "Accessibility & Disability Advocacy",
  "AI & Innovation",
  "Neurodiversity",
  "Education & Research",
  "XTERMIGATOR Kids",
  "Hellenic Kids",
  "Books & Publishing",
  "Apps & Technology",
  "Partnerships & Collaborations",
  "Community Events"
]);

function cleanText(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const firstName = cleanText(body.first_name, 80);
    const lastName = cleanText(body.last_name, 80);
    const email = cleanText(body.email, 254);
    const emailNormalized = email.toLowerCase();
    const phone = cleanText(body.phone, 40);
    const emailConsent = body.email_consent === true;
    const smsConsent = body.sms_consent === true;
    const sourceSite = cleanText(body.source_site, 120);
    const sourcePage = cleanText(body.source_page, 200);
    const campaign = cleanText(body.campaign, 120);
    const interests = Array.isArray(body.interests)
      ? body.interests.filter((x: unknown) => typeof x === "string" && allowedInterests.has(x))
      : [];

    if (!firstName || !email || !email.includes("@")) {
      return Response.json({ ok: false, error: "First name and a valid email are required." }, { status: 400 });
    }
    if (!emailConsent && !smsConsent) {
      return Response.json({ ok: false, error: "Please select at least one communication permission." }, { status: 400 });
    }
    if (smsConsent && !phone) {
      return Response.json({ ok: false, error: "A mobile number is required for text-message updates." }, { status: 400 });
    }

    const db = getDatabase();
    const client = await db.pool.connect();

    try {
      await client.query("BEGIN");

      const contactResult = await client.query(
        `
        INSERT INTO contacts (
          first_name, last_name, email, email_normalized, phone,
          email_consent, sms_consent, email_consent_at, sms_consent_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,
          CASE WHEN $6 THEN NOW() ELSE NULL END,
          CASE WHEN $7 THEN NOW() ELSE NULL END
        )
        ON CONFLICT (email_normalized)
        DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = COALESCE(NULLIF(EXCLUDED.last_name,''), contacts.last_name),
          email = EXCLUDED.email,
          phone = COALESCE(NULLIF(EXCLUDED.phone,''), contacts.phone),
          email_consent = contacts.email_consent OR EXCLUDED.email_consent,
          sms_consent = contacts.sms_consent OR EXCLUDED.sms_consent,
          email_consent_at = CASE
            WHEN EXCLUDED.email_consent AND contacts.email_consent_at IS NULL THEN NOW()
            ELSE contacts.email_consent_at END,
          sms_consent_at = CASE
            WHEN EXCLUDED.sms_consent AND contacts.sms_consent_at IS NULL THEN NOW()
            ELSE contacts.sms_consent_at END,
          updated_at = NOW()
        RETURNING id
        `,
        [firstName, lastName, email, emailNormalized, phone, emailConsent, smsConsent]
      );

      const contactId = contactResult.rows[0].id;

      for (const interest of interests) {
        await client.query(
          `INSERT INTO contact_interests (contact_id, interest)
           VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [contactId, interest]
        );
      }

      await client.query(
        `INSERT INTO signup_events
          (contact_id, source_site, source_page, campaign, consent_version)
         VALUES ($1,$2,$3,$4,'2026-09-v1')`,
        [contactId, sourceSite, sourcePage, campaign]
      );

      await client.query("COMMIT");
      return Response.json({ ok: true });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      return Response.json({ ok: false, error: "Unable to save your signup right now." }, { status: 500 });
    } finally {
      client.release();
    }
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
};

export const config: Config = {
  path: "/api/signup"
};
