require("dotenv").config(); 
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const oAuth = require("./middleware/oAuth");

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const CHALLENGES_API_URL = process.env.CHALLENGES_API_URL;

const app = express();

// Habilitar CORS usando variable de entorno
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(express.json());

//  Ruta protegida `/challenges`
app.post("/challenges", oAuth, async (req, res) => {
  try {
    if (!req.oauth || !req.oauth.access_token) {
      throw new Error("Access token missing from OAuth middleware");
    }

    console.log("🔄 Fetching challenges using access token...");

    //  Enviar el token de acceso a Challenges API
    const response = await axios.get(CHALLENGES_API_URL, {
      headers: { Authorization: `Bearer ${req.oauth.access_token}` },
    });

    console.log("✅ Challenges fetched successfully!");

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching challenges:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data || "Something went wrong",
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Dashboard Backend corriendo en el puerto ${PORT}`));
