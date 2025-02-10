require("dotenv").config(); // ✅ Carga las variables desde .env
const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const guard = require("express-jwt-permissions")();

// ✅ Cargar variables de entorno
const PORT = process.env.PORT || 8080;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_JWKS_URI = process.env.AUTH0_JWKS_URI;
const AUTH0_ISSUER = process.env.AUTH0_ISSUER;
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

// ✅ Habilitar CORS usando variable de entorno
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// ✅ Middleware de Autenticación JWT
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH0_JWKS_URI,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: true, // ✅ Asegura que req.user esté poblado
  requestProperty: "user",
});

// ✅ Middleware para registrar solicitudes entrantes (debug)
app.use((req, res, next) => {
  console.log(`🟢 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("🔍 Headers:", req.headers);
  next();
});

// ✅ Aplicar el Middleware JWT
app.use(jwtCheck);

// ✅ Middleware para registrar información del usuario autenticado (debug)
app.use((req, res, next) => {
  console.log("🛂 Usuario Decodificado JWT:", req.user);
  console.log("🔑 Permisos:", req.user?.permissions || "No permissions found");
  next();
});

// ✅ Ruta Protegida: Requiere permiso "read:challenges"
app.get("/challenges", (req, res, next) => {
  console.log("🔍 Verificando permisos para 'read:challenges'...");
  next();
}, guard.check(["read:challenges"]), (req, res) => {
  console.log("✅ Usuario autorizado para 'read:challenges'");
  res.json({
    challenge1: "Este es el primer desafío",
    challenge2: "Este es otro desafío",
  });
});

// ✅ Middleware de Manejo de Errores
app.use((err, req, res, next) => {
  console.error("❌ Error en Middleware:", err);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized", message: err.message });
  }

  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// ✅ Iniciar el Servidor
app.listen(PORT, () => console.log(`🚀 Challenges API corriendo en el puerto ${PORT}`));
