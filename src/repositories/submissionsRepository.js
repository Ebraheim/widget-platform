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

async function getSubmissionsByTenant(tenantId) {
  const query = `
    SELECT
      id,
      widget_id,
      payload,
      ip_address,
      country,
      city,
      spam_detected,
      created_at
    FROM submissions
    WHERE tenant_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [tenantId]);

  return result.rows;
}

async function getSubmissionStatsByTenant(tenantId) {
  const query = `
    SELECT
      COUNT(*)::int AS total_submissions,
      COUNT(*) FILTER (
        WHERE created_at >= NOW() - INTERVAL '24 hours'
      )::int AS submissions_last_24h,
      COUNT(*) FILTER (
        WHERE spam_detected = TRUE
      )::int AS spam_count
    FROM submissions
    WHERE tenant_id = $1
  `;

  const result = await pool.query(query, [tenantId]);

  return result.rows[0];
}

module.exports = {
  createSubmission,
  getSubmissionsByTenant,
  getSubmissionStatsByTenant,
};