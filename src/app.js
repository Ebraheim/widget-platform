const express = require("express");
const widgetRoutes = require("./routes/widgets");

const app = express();

app.use(express.json());
app.use("/api/widgets", widgetRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Widget Platform API is running",
  });
});

module.exports = app;