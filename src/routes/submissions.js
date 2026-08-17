const express = require("express");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");
const geoService = require("../services/geoService");
const widgetsService = require("../services/widgetsService");
const submissionsService = require("../services/submissionsService");
const pool = require("../db");
const notificationService = require("../services/notificationService");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many submissions. Please try again later.",
  },
});

const submissionSchema = z.object({
  widget_id: z.string().uuid(),
  data: z.record(z.string(), z.any()),
  website: z.string().optional().default(""),
});

// GET submission stats for authenticated tenant
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const stats =
      await submissionsService.getSubmissionStatsByTenant(req.tenant.id);

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Failed to get submission stats:", error);

    return res.status(500).json({
      error: "Failed to get submission stats",
    });
  }
});

// GET submissions for authenticated tenant
router.get("/", authMiddleware, async (req, res) => {
  try {
    const submissions =
      await submissionsService.getSubmissionsByTenant(req.tenant.id);

    return res.status(200).json(submissions);
  } catch (error) {
    console.error("Failed to get submissions:", error);

    return res.status(500).json({
      error: "Failed to get submissions",
    });
  }
});

router.post("/", submissionLimiter, async (req, res) => {
  const result = submissionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid submission data",
      details: result.error.issues,
    });
  }

  // Honeypot spam check
  if (result.data.website.trim() !== "") {
    return res.status(400).json({
      error: "Spam submission rejected",
    });
  }

  try {
    const widget = await widgetsService.getPublicWidgetConfig(
      result.data.widget_id
    );

    if (!widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    const fullWidget = await pool.query(
      "SELECT tenant_id FROM widgets WHERE id = $1",
      [result.data.widget_id]
    );

const tenantId = fullWidget.rows[0].tenant_id;

const geo = await geoService.enrichIp(req.ip);

const submission = await submissionsService.createSubmission({
  widgetId: result.data.widget_id,
  tenantId,
  payload: result.data.data,
  ipAddress: req.ip,
  country: geo.country,
  city: geo.city,
});

try {
  await notificationService.sendSubmissionNotification(submission);
} catch (notificationError) {
  console.error(
    "Notification side effect failed:",
    notificationError.message
  );
}

    return res.status(201).json({
      id: submission.id,
      message: "Submission received",
    });
  } catch (error) {
    console.error("Failed to create submission:", error);

    return res.status(500).json({
      error: "Failed to create submission",
    });
  }
});

module.exports = router;