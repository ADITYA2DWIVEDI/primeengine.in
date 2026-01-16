const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const admin = require('../config/firebase');
const db = require('../config/database');

const router = express.Router();

// Sign up
router.post('/signup', [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().notEmpty(),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, name, firebaseUid } = req.body;

        // Check if user exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Create user in database
        const userId = uuidv4();
        const result = await db.query(
            `INSERT INTO users (id, firebase_uid, email, name, role, credits, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 100, NOW(), NOW())
       RETURNING id, email, name, role, credits, created_at`,
            [userId, firebaseUid, email, name, 'user']
        );

        res.status(201).json({
            user: result.rows[0],
            message: 'Account created successfully',
        });
    } catch (error) {
        next(error);
    }
});

// Login - Sync Firebase user with database
router.post('/login', async (req, res, next) => {
    try {
        const { email } = req.body;

        const result = await db.query(
            'SELECT id, email, name, role, credits, created_at FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Google OAuth handling
router.post('/google', async (req, res, next) => {
    try {
        const { idToken } = req.body;

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // Check if user exists
        let result = await db.query(
            'SELECT id, email, name, role, avatar_url, credits, created_at FROM users WHERE firebase_uid = $1',
            [uid]
        );

        if (result.rows.length === 0) {
            // Create new user
            const userId = uuidv4();
            result = await db.query(
                `INSERT INTO users (id, firebase_uid, email, name, avatar_url, role, credits, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 100, NOW(), NOW())
         RETURNING id, email, name, role, avatar_url, credits, created_at`,
                [userId, uid, email, name || email.split('@')[0], picture, 'user']
            );
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Get current user profile
router.get('/me', require('../middleware/auth').authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT id, email, name, role, avatar_url, credits, created_at FROM users WHERE firebase_uid = $1',
            [req.user.uid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Update profile
router.put('/profile', require('../middleware/auth').authMiddleware, [
    body('name').optional().trim().notEmpty(),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;

        const result = await db.query(
            `UPDATE users SET name = COALESCE($1, name), updated_at = NOW()
       WHERE firebase_uid = $2
       RETURNING id, email, name, role, avatar_url, credits, created_at`,
            [name, req.user.uid]
        );

        res.json({ user: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
