const express = require("express");

const router = express.Router();

router.get("/", function (_req, res) {
  res.render("index", { title: "Express nodejs service" });
});

module.exports = router;
