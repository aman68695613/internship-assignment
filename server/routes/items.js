const express = require("express");
const multer = require("multer");
const path = require("path");
const { addItem, getItems, enquireItem } = require("../controllers/itemController");

const router = express.Router();

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "server/uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post("/", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 5 }
]), addItem);

router.get("/", getItems);
router.get("/status", (req, res) => {
  res.json({ status: "API is running" });
})

router.post("/:id/enquire", enquireItem);

module.exports = router;
