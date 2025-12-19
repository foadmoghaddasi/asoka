const express = require("express");
const path = require("path");

const app = express();
const dist = path.join(__dirname, "dist");

// فایل‌های واقعی مثل /assets/... و ... را مستقیم سرو کن
app.use(express.static(dist));

// روت‌های SPA → همیشه index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
