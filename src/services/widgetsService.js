const widgetsRepository = require("../repositories/widgetsRepository");

async function createWidget({
  tenantId,
  type,
  title,
  description,
  buttonText,
}) {
  return widgetsRepository.createWidget({
    tenantId,
    type,
    title,
    description,
    buttonText,
  });
}

async function getWidgetsByTenant(tenantId) {
  return widgetsRepository.getWidgetsByTenant(tenantId);
}

async function getWidgetById(tenantId, widgetId) {
  return widgetsRepository.getWidgetById(tenantId, widgetId);
}

async function updateWidget({
  tenantId,
  widgetId,
  type,
  title,
  description,
  buttonText,
}) {
  return widgetsRepository.updateWidget({
    tenantId,
    widgetId,
    type,
    title,
    description,
    buttonText,
  });
}

async function deleteWidget(tenantId, widgetId) {
  return widgetsRepository.deleteWidget(tenantId, widgetId);
}

async function getPublicWidgetConfig(widgetId) {
  return widgetsRepository.getPublicWidgetConfig(widgetId);
}

async function getWidgetTenantId(widgetId) {
  return widgetsRepository.getWidgetTenantId(widgetId);
}

module.exports = {
  createWidget,
  getWidgetsByTenant,
  getWidgetById,
  updateWidget,
  deleteWidget,
  getPublicWidgetConfig,
  getWidgetTenantId,
};