const crypto = require("crypto");

/**
 * Convert a buffer to a URL-safe base64-encoded string.
 */
function base64URLEncode(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Generate a cryptographically secure Code Verifier (43-128 characters)
 */
function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32)); // Generates a 32-byte random string
}

/**
 * Generate a Code Challenge (SHA-256 hash of Code Verifier)
 */
function generateCodeChallenge(codeVerifier) {
  return base64URLEncode(crypto.createHash("sha256").update(codeVerifier).digest());
}

// ✅ Export functions
module.exports = { generateCodeVerifier, generateCodeChallenge };
