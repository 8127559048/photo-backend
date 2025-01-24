const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static('uploads'));

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    },
});
const upload = multer({ storage });

// Gmail Notification Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pritamgamer8127@gmail.com', // Aapka Gmail
        pass: 'qbtm irxi kcsf hrut', // App Password
    },
});

// Route to Upload Photo
app.post('/upload', upload.single('photo'), (req, res) => {
    const photoURL = `https://photo-backend-y16j.onrender.com/${req.file.filename}`; // Change backend URL as per Render

    // Send Email Notification
    const mailOptions = {
        from: 'pritamgamer8127@gmail.com',
        to: 'pritamgamer8127@gmail.com',
        subject: 'New Photo Uploaded',
        text: `A new photo has been uploaded. You can access it here: ${photoURL}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            res.json({
                message: 'Photo uploaded successfully!',
                filePath: photoURL,
            });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
