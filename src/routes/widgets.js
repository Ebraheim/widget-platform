const express = require("express");
const { randomUUID } = require("crypto");
const { z } = require("zod");

const router = express.Router();

const widgets = [];

const widgetSchema = z.object({
  type: z.enum(["signup", "contact", "cta", "popover"]),
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  button_text: z.string().trim().min(1),
});

router.post("/", (req, res) => {
  const result = widgetSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid widget data",
      details: result.error.issues,
    });
  }

  const widget = {
    id: randomUUID(),
    ...result.data,
    created_at: new Date().toISOString(),
  };

  widgets.push(widget);

  return res.status(201).json(widget);
});

module.exports = router;