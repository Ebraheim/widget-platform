const pool = require("../db");

async function authMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      error: "Missing API key",
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT id, name
        FROM tenants
        WHERE api_key = $1
      `,
      [apiKey]
    );

    const tenant = result.rows[0];

    if (!tenant) {
      return res.status(401).json({
        error: "Invalid API key",
      });
    }

    req.tenant = tenant;

    next();
  } catch (error) {
    console.error("Authentication failed:", error);

    return res.status(500).json({
      error: "Authentication failed",
    });
  }
}

module.exports = authMiddleware;