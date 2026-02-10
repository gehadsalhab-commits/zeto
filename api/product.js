const API_BASE = "https://onlineshop.kludi.com";

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

  const sku = (req.query?.sku || "").toString().trim();
  if (!sku) {
    res.status(400).json({ error: "Missing sku" });
    return;
  }

  const url = `${API_BASE}/rest/V1/products/?searchCriteria[filterGroups][0][filters][0][field]=sku&searchCriteria[filterGroups][0][filters][0][value]=${encodeURIComponent(sku)}&searchCriteria[filterGroups][0][filters][0][condition_type]=eq`;
  const bearerToken = process.env.BEARER_TOKEN || "";

  try {
    const response = await fetch(url, {
      headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {},
    });

    if (!response.ok) {
      res.status(response.status).json({ error: "Upstream error" });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed" });
  }
};
