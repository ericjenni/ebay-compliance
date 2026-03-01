export default function handler(req, res) {
  // Respond OK to eBay "are you alive" checks
  if (req.method === "GET") {
    return res.status(200).json({ status: "ok" });
  }

  // Respond OK to eBay account deletion notifications (POST)
  if (req.method === "POST") {
    return res.status(200).json({ status: "received" });
  }

  return res.status(200).json({ status: "ok" });
}
