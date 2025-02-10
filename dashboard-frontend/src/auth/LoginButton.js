import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { generateCodeVerifier, generateCodeChallenge } from "../auth/pkceUtils";

const LoginButton = () => {
  const location = useLocation();

  const handleLogin = async () => {
    try {
      // ✅ Verificar si ya existe el código de autorización en la URL
      const { code } = queryString.parse(location.search);
      if (code) {
        console.log("✅ Authorization code found in URL, skipping redirect.");
        return;
      }

      console.log("🔄 Generating PKCE values...");

      // ✅ Generar `code_verifier`
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      console.log("✅ Code Verifier:", codeVerifier);
      console.log("✅ Code Challenge:", codeChallenge);

      // ✅ Almacenar `code_verifier` en localStorage antes del redireccionamiento
      localStorage.setItem("pkce_code_verifier", codeVerifier);

      // ✅ Construir la URL de autorización usando variables de entorno
      const authUrl = new URL(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize`);
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("client_id", process.env.REACT_APP_AUTH0_CLIENT_ID);
      authUrl.searchParams.append("redirect_uri", process.env.REACT_APP_AUTH0_REDIRECT_URI);
      authUrl.searchParams.append("scope", "openid profile email read:challenges offline_access");
      authUrl.searchParams.append("audience", process.env.REACT_APP_AUTH0_AUDIENCE);
      authUrl.searchParams.append("code_challenge", codeChallenge);
      authUrl.searchParams.append("code_challenge_method", "S256");

      console.log("🔄 Redirecting to Auth0:", authUrl.toString());

      // ✅ Redireccionar manualmente al usuario a Auth0
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("❌ Error in manual Auth0 redirect:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <button className="Login-button" onClick={handleLogin}>
      Log In
    </button>
  );
};

export default LoginButton;
