const submissionsRepository = require("../repositories/submissionsRepository");

async function createSubmission({
  widgetId,
  tenantId,
  payload,
  ipAddress,
  country = null,
  city = null,
  spamDetected = false,
}) {
  return submissionsRepository.createSubmission({
    widgetId,
    tenantId,
    payload,
    ipAddress,
    country,
    city,
    spamDetected,
  });
}

async function getSubmissionsByTenant(tenantId) {
  return submissionsRepository.getSubmissionsByTenant(tenantId);
}

async function getSubmissionStatsByTenant(tenantId) {
  return submissionsRepository.getSubmissionStatsByTenant(tenantId);
}

module.exports = {
  createSubmission,
  getSubmissionsByTenant,
  getSubmissionStatsByTenant,
};