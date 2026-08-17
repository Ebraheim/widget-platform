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

// GET all widgets
router.get("/", (req, res) => {
  return res.status(200).json(widgets);
});

// GET one widget
router.get("/:id", (req, res) => {
  const widget = widgets.find((item) => item.id === req.params.id);

  if (!widget) {
    return res.status(404).json({
      error: "Widget not found",
    });
  }

  return res.status(200).json(widget);
});

// CREATE widget
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

// UPDATE widget
router.put("/:id", (req, res) => {
  const widgetIndex = widgets.findIndex(
    (item) => item.id === req.params.id
  );

  if (widgetIndex === -1) {
    return res.status(404).json({
      error: "Widget not found",
    });
  }

  const result = widgetSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid widget data",
      details: result.error.issues,
    });
  }

  const updatedWidget = {
    ...widgets[widgetIndex],
    ...result.data,
    updated_at: new Date().toISOString(),
  };

  widgets[widgetIndex] = updatedWidget;

  return res.status(200).json(updatedWidget);
});

// DELETE widget
router.delete("/:id", (req, res) => {
  const widgetIndex = widgets.findIndex(
    (item) => item.id === req.params.id
  );

  if (widgetIndex === -1) {
    return res.status(404).json({
      error: "Widget not found",
    });
  }

  widgets.splice(widgetIndex, 1);

  return res.status(204).send();
});

module.exports = router;