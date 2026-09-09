export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Read the raw body and forward it directly to Substack
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString();

  try {
    const r = await fetch(
      "https://dearajayi.substack.com/api/v1/free?nojs=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://dearajayi.substack.com/embed",
          Origin: "https://dearajayi.substack.com",
        },
        body: rawBody,
      }
    );

    const text = await r.text();

    if (r.ok || r.status === 302) {
      return res.redirect(302, "/#/about");
    }

    // Log the actual Substack response for debugging
    return res.status(r.status).json({
      error: "Substack returned an error",
      substackStatus: r.status,
      substackBody: text.substring(0, 200),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Substack" });
  }
}

export const config = { api: { bodyParser: false } };
