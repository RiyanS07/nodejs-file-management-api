const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadFile,
    getAllFiles,
    downloadFile,
    updateFile,
    deleteFile
} = require("../controllers/fileControllers");

// POST /files — upload a file
router.post("/", authenticateToken, upload.single("file"), uploadFile);

// GET /files — list file metadata
router.get("/", authenticateToken, getAllFiles);

// GET /files/:id — download a file
router.get("/:id", authenticateToken, downloadFile);

// PUT /files/:id — update file metadata
router.put("/:id", authenticateToken, updateFile);

// DELETE /files/:id — delete a file
router.delete("/:id", authenticateToken, deleteFile);

module.exports = router;
