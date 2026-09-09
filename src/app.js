const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const { sanitizeInputs } = require("./middleware/sanitize");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const articleRoutes = require("./routes/articleRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const teamRoutes = require("./routes/teamRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// --- Core middleware ---
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin header) and any configured origin
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(sanitizeInputs);

// --- Health check ---
app.get("/", (req, res) => res.json({ status: "ok", service: "Sayf Technology API", version: "v1" }));
app.get("/v1/health", (req, res) => res.json({ status: "ok" }));

// --- API v1 routes ---
const v1 = express.Router();
v1.use("/auth", authRoutes);
v1.use("/projects", projectRoutes);
v1.use("/articles", articleRoutes);
v1.use("/testimonials", testimonialRoutes);
v1.use("/team", teamRoutes);
v1.use("/contact", contactRoutes);
v1.use("/newsletter", newsletterRoutes);
v1.use("/media", mediaRoutes);
v1.use("/settings", settingsRoutes);
v1.use("/admin", adminRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/v1", v1);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
