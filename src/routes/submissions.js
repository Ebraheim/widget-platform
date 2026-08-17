const express = require("express");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");

const widgetsService = require("../services/widgetsService");
const submissionsService = require("../services/submissionsService");
const pool = require("../db");

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

    const submission = await submissionsService.createSubmission({
      widgetId: result.data.widget_id,
      tenantId,
      payload: result.data.data,
      ipAddress: req.ip,
    });

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