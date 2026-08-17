const pool = require("../db");

async function createWidget({
  tenantId,
  type,
  title,
  description,
  buttonText,
}) {
  const query = `
    INSERT INTO widgets (
      tenant_id,
      type,
      title,
      description,
      button_text
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    tenantId,
    type,
    title,
    description,
    buttonText,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

async function getWidgetsByTenant(tenantId) {
  const query = `
    SELECT *
    FROM widgets
    WHERE tenant_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [tenantId]);

  return result.rows;
}

async function getWidgetById(tenantId, widgetId) {
  const query = `
    SELECT *
    FROM widgets
    WHERE id = $1
      AND tenant_id = $2
  `;

  const result = await pool.query(query, [widgetId, tenantId]);

  return result.rows[0] || null;
}

async function updateWidget({
  tenantId,
  widgetId,
  type,
  title,
  description,
  buttonText,
}) {
  const query = `
    UPDATE widgets
    SET
      type = $1,
      title = $2,
      description = $3,
      button_text = $4,
      updated_at = NOW()
    WHERE id = $5
      AND tenant_id = $6
    RETURNING *
  `;

  const values = [
    type,
    title,
    description,
    buttonText,
    widgetId,
    tenantId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
}

async function deleteWidget(tenantId, widgetId) {
  const query = `
    DELETE FROM widgets
    WHERE id = $1
      AND tenant_id = $2
    RETURNING id
  `;

  const result = await pool.query(query, [widgetId, tenantId]);

  return result.rows[0] || null;
}

module.exports = {
  createWidget,
  getWidgetsByTenant,
  getWidgetById,
  updateWidget,
  deleteWidget,
};