const express = require("express");
const path = require("path");
const cors = require("cors");

const widgetRoutes = require("./routes/widgets");
const publicWidgetRoutes = require("./routes/publicWidgets");
const submissionRoutes = require("./routes/submissions");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use(
  express.static(path.join(__dirname, "../public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("widget.v1.js")) {
        res.setHeader(
          "Cache-Control",
          "public, max-age=31536000, immutable"
        );
      }
    },
  })
);

app.use("/api/widgets", widgetRoutes);
app.use("/widgets", publicWidgetRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Widget Platform API is running",
  });
});

module.exports = app;