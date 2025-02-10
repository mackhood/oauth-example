import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import "./Challenges.css";

const Challenges = () => {
  const [challengesData, setChallengesData] = useState("Loading...");
  const location = useLocation();

  useEffect(() => {
    const fetchChallenges = async () => {
      console.log("🔍 Full URL:", window.location.href);

      // ✅ Extraer `code` de la URL
      const { code } = queryString.parse(location.search);
      if (!code) {
        console.error("❌ No authorization code found in URL!");
        setChallengesData("Error: No authorization code found.");
        return;
      }

      console.log("🔍 Extracted Authorization Code:", code);

      // ✅ Recuperar el `code_verifier`
      const codeVerifier = localStorage.getItem("pkce_code_verifier");
      if (!codeVerifier) {
        console.error("❌ Missing code_verifier!");
        setChallengesData("Error: Missing PKCE code verifier.");
        return;
      }

      console.log("✅ Found code_verifier:", codeVerifier);
      console.log("🔄 Sending data to backend...", { code, codeVerifier });

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/challenges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, codeVerifier }),
        });

        const data = await response.json();
        console.log("✅ Backend response:", data);
        setChallengesData(JSON.stringify(data));

        // ✅ Limpiar el código de la URL después de la autenticación
        window.history.replaceState({}, document.title, "/challenges");
      } catch (error) {
        console.error("❌ Error fetching challenges:", error);
        setChallengesData("Error loading challenges");
      }
    };

    fetchChallenges();
  }, [location.search]);

  return (
    <div className="Challenges-body">
      <h3>Challenges</h3>
      <h5 className="Content">{challengesData}</h5>
    </div>
  );
};

export default Challenges;
