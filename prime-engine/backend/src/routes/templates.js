const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all templates
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const { category, search } = req.query;

        let query = 'SELECT id, name, description, category, thumbnail_url, is_featured, created_at FROM templates WHERE 1=1';
        const params = [];

        if (category && category !== 'All') {
            params.push(category);
            query += ` AND category = $${params.length}`;
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
        }

        query += ' ORDER BY is_featured DESC, created_at DESC';

        const result = await db.query(query, params);
        res.json({ templates: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get featured templates
router.get('/featured', async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT id, name, description, category, thumbnail_url, is_featured, created_at
       FROM templates
       WHERE is_featured = true
       ORDER BY created_at DESC
       LIMIT 6`
        );

        res.json({ templates: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get template categories
router.get('/categories', async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT DISTINCT category FROM templates ORDER BY category'
        );

        const categories = ['All', ...result.rows.map(r => r.category)];
        res.json({ categories });
    } catch (error) {
        next(error);
    }
});

// Get single template
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM templates WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ template: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Use template to create project
router.post('/:id/use', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get template
        const templateResult = await db.query(
            'SELECT * FROM templates WHERE id = $1',
            [id]
        );

        if (templateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        const template = templateResult.rows[0];

        // Get user ID
        const userResult = await db.query(
            'SELECT id FROM users WHERE firebase_uid = $1',
            [req.user.uid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.rows[0].id;
        const projectId = uuidv4();

        // Create project from template
        const result = await db.query(
            `INSERT INTO projects (id, user_id, name, description, canvas_state, template_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'ready', NOW(), NOW())
       RETURNING *`,
            [
                projectId,
                userId,
                `${template.name} Copy`,
                template.description,
                template.canvas_state,
                id
            ]
        );

        res.status(201).json({ project: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
