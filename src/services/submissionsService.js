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

module.exports = {
  createSubmission,
};