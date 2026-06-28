const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = process.env.DB_PATH || './smae-contacts.db';
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LdEFDotAAAAAKQxzt23KxLNqanTRRc9p85X2EAc';
const RECAPTCHA_ENABLED = RECAPTCHA_SECRET_KEY && !RECAPTCHA_SECRET_KEY.includes('YOUR_RECAPTCHA_SECRET_KEY');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQLite Database Connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('SQLite database connected successfully');
        initializeDatabase();
    }
});

// Initialize database table
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating contacts table:', err);
        } else {
            console.log('Contacts table ready');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS student_corner (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            applicantName TEXT NOT NULL,
            applicantEmail TEXT NOT NULL,
            applicantPhone TEXT NOT NULL,
            applicantDesignation TEXT NOT NULL,
            instituteName TEXT NOT NULL,
            instituteAddress TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating student_corner table:', err);
        } else {
            console.log('Student corner table ready');
        }
    });
}

// Helper function to run DB queries
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Routes

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'SMAE Database API running (SQLite)' });
});

// POST: Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message, recaptchaToken } = req.body;

        // Validation
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Verify reCAPTCHA token if enabled
        if (RECAPTCHA_ENABLED) {
            if (!recaptchaToken) {
                return res.status(400).json({ error: 'reCAPTCHA verification failed' });
            }

            try {
                const recaptchaResponse = await axios.post(
                    'https://www.google.com/recaptcha/api/siteverify',
                    null,
                    {
                        params: {
                            secret: RECAPTCHA_SECRET_KEY,
                            response: recaptchaToken,
                        },
                    }
                );

                // Check if verification successful and score is above threshold
                if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
                    return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
                }
            } catch (captchaError) {
                console.error('reCAPTCHA error:', captchaError);
                return res.status(400).json({ error: 'Failed to verify reCAPTCHA' });
            }
        } else {
            console.warn('reCAPTCHA is disabled for this server instance. Skipping verification.');
        }

        // Insert into database
        const result = await runQuery(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, subject, message]
        );

        // Fetch the inserted record
        const contact = await getQuery(
            'SELECT * FROM contacts WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will respond shortly.',
            data: contact,
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to save contact information' });
    }
});

// POST: Submit student corner form
app.post('/api/student-corner', async (req, res) => {
    try {
        const {
            applicantName,
            applicantEmail,
            applicantPhone,
            applicantDesignation,
            instituteName,
            instituteAddress,
        } = req.body;

        if (
            !applicantName ||
            !applicantEmail ||
            !applicantPhone ||
            !applicantDesignation ||
            !instituteName ||
            !instituteAddress
        ) {
            return res.status(400).json({ error: 'All fields are required for student corner submission' });
        }

        const result = await runQuery(
            'INSERT INTO student_corner (applicantName, applicantEmail, applicantPhone, applicantDesignation, instituteName, instituteAddress) VALUES (?, ?, ?, ?, ?, ?)',
            [applicantName, applicantEmail, applicantPhone, applicantDesignation, instituteName, instituteAddress]
        );

        const studentEntry = await getQuery(
            'SELECT * FROM student_corner WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            success: true,
            message: 'Student corner application submitted successfully.',
            data: studentEntry,
        });
    } catch (error) {
        console.error('Error saving student corner form:', error);
        res.status(500).json({ error: 'Failed to save student corner application' });
    }
});

// GET: Retrieve all contacts (admin only - can add authentication later)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await allQuery(
            'SELECT * FROM contacts ORDER BY createdAt DESC'
        );
        res.json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
});

// GET: Retrieve single contact by ID
app.get('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await getQuery(
            'SELECT * FROM contacts WHERE id = ?',
            [req.params.id]
        );
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        console.error('Error retrieving contact:', error);
        res.status(500).json({ error: 'Failed to retrieve contact' });
    }
});

// DELETE: Remove contact by ID
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        await runQuery(
            'DELETE FROM contacts WHERE id = ?',
            [req.params.id]
        );
        res.json({
            success: true,
            message: 'Contact deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error('Error closing database:', err);
        else console.log('Database connection closed');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database: ${DB_PATH}`);
});
