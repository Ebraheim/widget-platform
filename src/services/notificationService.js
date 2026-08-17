async function sendSubmissionNotification(submission) {
  console.log(
    `Notification: new submission ${submission.id} received`
  );

  return {
    success: true,
  };
}

module.exports = {
  sendSubmissionNotification,
};