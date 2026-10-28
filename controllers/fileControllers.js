const fs = require("fs");
const path = require("path");
const File = require("../models/filemodel");
const {sendSuccess, sendFailure} = require("../responseHandler");

const uploadDir = path.join(__dirname,"..","uploads");

// POST /files
function uploadFile(req, res) {
    try {
        if (!req.file) {
            return sendFailure(
                res, 400,
                "Please upload a file using field name 'file'."
            );
        }

        const uploaded_by = req.body.uploaded_by;

        if (!uploaded_by) {
            fs.unlinkSync(req.file.path);
            return sendFailure(res, 400, "uploaded_by is required.");
        }

        const result = File.create({
            name: req.file.originalname,
            type: req.file.mimetype,
            uploaded_by,
            file_path: req.file.filename
        });

        return sendSuccess(res, 201, "File uploaded successfully.", {
            id: result.lastInsertRowid,
            name: req.file.originalname,
            type: req.file.mimetype,
            uploaded_by
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error("Upload error:", error);
        return sendFailure(res, 500, "Failed to save file data.");
    }
}

// GET /files
function getAllFiles(req, res) {
    try {
        const files = File.findAll();
        return sendSuccess(res, 200, "Files retrieved successfully.", files);
    } catch (error) {
        console.error("Fetch files error:", error);
        return sendFailure(res, 500, "Failed to fetch files.");
    }
}

// GET /files/:id
function downloadFile(req, res) {
    try {
        const file = File.findById(req.params.id);

        if (!file) {
            return sendFailure(res, 404, "File record not found.");
        }

        const filePath = path.join(uploadDir, file.file_path);

        if (!fs.existsSync(filePath)) {
            return sendFailure(
                res, 404,
                "File record exists, but the physical file is missing."
            );
        }

        return res.download(filePath, file.name);
    } catch (error) {
        console.error("Download error:", error);
        return sendFailure(res, 500, "Failed to retrieve file.");
    }
}

// PUT /files/:id
function updateFile(req, res) {
    try {
        const file = File.findById(req.params.id);

        if (!file) {
            return sendFailure(res, 404, "File record not found.");
        }

        const uploaded_by = req.body.uploaded_by;

        if (!uploaded_by) {
            return sendFailure(res, 400, "uploaded_by is required.");
        }

        File.updateUploadedBy(req.params.id, uploaded_by);

        return sendSuccess(res, 200, "File metadata updated successfully.", {
            id: Number(req.params.id),
            uploaded_by
        });
    } catch (error) {
        console.error("Update file error:", error);
        return sendFailure(res, 500, "Failed to update file.");
    }
}

// DELETE /files/:id
function deleteFile(req, res) {
    try {
        const file = File.findById(req.params.id);
        const uploaded_by = req.user.id;

        if (!file) {
            return sendFailure(res, 404, "File record not found.");
        }

        const filePath = path.join(uploadDir, file.file_path);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        File.deleteById(req.params.id);

        return sendSuccess(res, 200, "File and metadata deleted successfully.", {
            id: Number(req.params.id)
        });
    } catch (error) {
        console.error("Delete file error:", error);
        return sendFailure(res, 500, "Failed to delete file.");
    }
}

module.exports = {
    uploadFile,
    getAllFiles,
    downloadFile,
    updateFile,
    deleteFile
};
