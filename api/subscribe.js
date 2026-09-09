export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse the raw body since Vercel doesn't auto-parse form data
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const params = new URLSearchParams(raw);

  const body = new URLSearchParams();
  for (const [key, value] of params) {
    body.append(key, value);
  }

  try {
    const r = await fetch(
      "https://dearajayi.substack.com/api/v1/free?nojs=true",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );

    if (r.ok || r.status === 302) {
      return res.redirect(302, "/#/about");
    }

    return res.status(502).json({ error: "Substack returned an error" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Substack" });
  }
}

export const config = { api: { bodyParser: false } };
