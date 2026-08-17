const express = require("express");
const { randomUUID } = require("crypto");
const { z } = require("zod");
const widgetsService = require("../services/widgetsService");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

const widgets = [];

const widgetSchema = z.object({
  type: z.enum(["signup", "contact", "cta", "popover"]),
  title: z.string().trim().min(1),
  description: z.string().trim().optional().default(""),
  button_text: z.string().trim().min(1),
});

// GET all widgets
router.get("/", async (req, res) => {
  try {
    const tenantId = req.tenant.id;

    const widgets = await widgetsService.getWidgetsByTenant(tenantId);

    return res.status(200).json(widgets);
  } catch (error) {
    console.error("Failed to get widgets:", error);

    return res.status(500).json({
      error: "Failed to get widgets",
    });
  }
});

// GET one widget
router.get("/:id", async (req, res) => {
  try {
    const tenantId = req.tenant.id;

    const widget = await widgetsService.getWidgetById(
      tenantId,
      req.params.id
    );

    if (!widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    return res.status(200).json(widget);
  } catch (error) {
    console.error("Failed to get widget:", error);

    return res.status(500).json({
      error: "Failed to get widget",
    });
  }
});

// CREATE widget
router.post("/", async (req, res) => {
  const result = widgetSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid widget data",
      details: result.error.issues,
    });
  }

  try {
    const widget = await widgetsService.createWidget({
      tenantId: req.headers["x-tenant-id"],
      type: result.data.type,
      title: result.data.title,
      description: result.data.description,
      buttonText: result.data.button_text,
    });

    return res.status(201).json(widget);
  } catch (error) {
    console.error("Failed to create widget:", error);

    return res.status(500).json({
      error: "Failed to create widget",
    });
  }
});


// UPDATE widget
router.put("/:id", async (req, res) => {
  const result = widgetSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid widget data",
      details: result.error.issues,
    });
  }

  try {
    const tenantId = req.tenant.id;

    const widget = await widgetsService.updateWidget({
      tenantId,
      widgetId: req.params.id,
      type: result.data.type,
      title: result.data.title,
      description: result.data.description,
      buttonText: result.data.button_text,
    });

    if (!widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    return res.status(200).json(widget);
  } catch (error) {
    console.error("Failed to update widget:", error);

    return res.status(500).json({
      error: "Failed to update widget",
    });
  }
});

// DELETE widget
router.delete("/:id", async (req, res) => {
  try {
    const tenantId = req.tenant.id;

    const deletedWidget = await widgetsService.deleteWidget(
      tenantId,
      req.params.id
    );

    if (!deletedWidget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete widget:", error);

    return res.status(500).json({
      error: "Failed to delete widget",
    });
  }
});

module.exports = router;