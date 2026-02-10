const ALLOWED_HOST = "onlineshop.kludi.com";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawUrl = (req.query?.url || "").toString().trim();
  if (!rawUrl) {
    res.status(400).json({ error: "Missing url" });
    return;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (error) {
    res.status(400).json({ error: "Invalid url" });
    return;
  }

  if (parsed.host !== ALLOWED_HOST) {
    res.status(400).json({ error: "Host not allowed" });
    return;
  }

  try {
    const response = await fetch(parsed.toString());
    if (!response.ok) {
      res.status(response.status).json({ error: "Upstream error" });
      return;
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed" });
  }
};
