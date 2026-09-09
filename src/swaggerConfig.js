const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sayf Technology API",
      version: "1.0.0",
      description: "API documentation for Sayf Technology backend",
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5000/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Point this at every route file with @swagger comments
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);