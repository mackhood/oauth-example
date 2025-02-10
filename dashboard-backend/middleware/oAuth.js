require("dotenv").config(); 
const axios = require("axios");

const AUTH0_TOKEN_ENDPOINT = process.env.AUTH0_TOKEN_ENDPOINT;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI;

const oAuth = async (req, res, next) => {
  try {
    const { code, codeVerifier } = req.body; // Recibe codeVerifier desde el frontend

    console.log("🔍 Request Body:", JSON.stringify(req.body, null, 2));

    if (!code) {
      return res.status(401).json({ error: "Missing authorization code" });
    }
    if (!codeVerifier) {
      return res.status(401).json({ error: "Missing code_verifier" });
    }

    console.log("🔄 Exchanging authorization code for access token with PKCE...");
    console.log("📝 Code:", code);
    console.log("📝 Code Verifier:", codeVerifier);

    //  Parámetros para el intercambio del código por un token de acceso
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", AUTH0_CLIENT_ID);
    params.append("client_secret", AUTH0_CLIENT_SECRET);
    params.append("code", code);
    params.append("code_verifier", codeVerifier);
    params.append("redirect_uri", AUTH0_REDIRECT_URI); //  Debe coincidir con Auth0

    //  Realizar la petición al endpoint de Auth0
    const response = await axios.post(AUTH0_TOKEN_ENDPOINT, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("✅ Token exchange successful!");

    req.oauth = response.data; //  Guardar el token en `req.oauth`
    next();
  } catch (err) {
    console.error("❌ Token Exchange Error:", err.response?.data || err.message);
    res.status(403).json({ error: "Failed to exchange authorization code for access token" });
  }
};

module.exports = oAuth;
