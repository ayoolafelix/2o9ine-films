export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
        body: body.toString(),
      }
    );

    if (r.ok || r.status === 302) {
      return res.redirect(302, "/#/about");
    }

    return res.status(r.status).json({ error: "Substack returned an error" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Substack" });
  }
}

export const config = { api: { bodyParser: false } };
