const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static('uploads'));

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});
const upload = multer({ storage });

// Route to Upload Photo
app.post('/upload', upload.single('photo'), (req, res) => {
    res.json({
        message: 'Photo uploaded successfully!',
        filePath: `http://localhost:${PORT}/${req.file.filename}`,
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
