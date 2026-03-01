import crypto from "crypto";

export default async function handler(req, res) {
  // Must always return quickly
  res.setHeader("Content-Type", "application/json");

  // Your verification token (must match the one you enter in eBay portal)
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  if (!verificationToken) {
    return res.status(500).json({ error: "Missing EBAY_VERIFICATION_TOKEN env var" });
  }

  // eBay validation calls include a challenge_code (commonly)
  // They may send it via query string or JSON body.
  const challengeCode =
    (req.query && (req.query.challenge_code || req.query.challengeCode)) ||
    (req.body && (req.body.challenge_code || req.body.challengeCode));

  // If this is the validation challenge, respond with challengeResponse
  if (challengeCode) {
    // The usual required value is SHA-256 of: challengeCode + verificationToken + endpoint
    // eBay’s docs specify the concatenation pattern for the challenge response.
    // Use the exact endpoint URL you register in eBay (no trailing slash mismatch).
    const endpoint = process.env.EBAY_ENDPOINT_URL;
    if (!endpoint) {
      return res.status(500).json({ error: "Missing EBAY_ENDPOINT_URL env var" });
    }

    const hash = crypto
      .createHash("sha256")
      .update(challengeCode + verificationToken + endpoint)
      .digest("hex");

    return res.status(200).json({ challengeResponse: hash });
  }

  // Otherwise, handle actual deletion notifications (POST)
  // Acknowledge receipt
  return res.status(200).json({ status: "received" });
}
