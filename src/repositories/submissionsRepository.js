const pool = require("../db");

async function createSubmission({
  widgetId,
  tenantId,
  payload,
  ipAddress,
  country = null,
  city = null,
  spamDetected = false,
}) {
  const query = `
    INSERT INTO submissions (
      widget_id,
      tenant_id,
      payload,
      ip_address,
      country,
      city,
      spam_detected
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    widgetId,
    tenantId,
    payload,
    ipAddress,
    country,
    city,
    spamDetected,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

module.exports = {
  createSubmission,
};