const express = require("express");
const widgetsService = require("../services/widgetsService");

const router = express.Router();

router.get("/:id/config", async (req, res) => {
  try {
    const widget = await widgetsService.getPublicWidgetConfig(req.params.id);

    if (!widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    res.set("Cache-Control", "public, max-age=60");

    return res.status(200).json(widget);
  } catch (error) {
    console.error("Failed to get public widget config:", error);

    return res.status(500).json({
      error: "Failed to get widget config",
    });
  }
});

module.exports = router;