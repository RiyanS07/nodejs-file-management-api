require("dotenv").config();

const express = require("express");
const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");

// Global middleware
app.use(express.json());

// Register routes
app.use("/", authRoutes);
app.use("/files", fileRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});


// Start server only when this file is run directly
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
