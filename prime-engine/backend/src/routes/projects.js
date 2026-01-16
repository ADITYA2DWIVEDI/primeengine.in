const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all projects for user
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT p.id, p.name, p.description, p.status, p.deployed_url, p.created_at, p.updated_at
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE u.firebase_uid = $1
       ORDER BY p.updated_at DESC`,
            [req.user.uid]
        );

        res.json({ projects: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT p.*
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.firebase_uid = $2`,
            [id, req.user.uid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Create project
router.post('/', authMiddleware, [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, templateId } = req.body;

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

        // If using a template, copy its canvas state
        let canvasState = null;
        if (templateId) {
            const templateResult = await db.query(
                'SELECT canvas_state FROM templates WHERE id = $1',
                [templateId]
            );
            if (templateResult.rows.length > 0) {
                canvasState = templateResult.rows[0].canvas_state;
            }
        }

        const result = await db.query(
            `INSERT INTO projects (id, user_id, name, description, status, canvas_state, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
            [projectId, userId, name, description, 'draft', canvasState]
        );

        res.status(201).json({ project: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Update project
router.put('/:id', authMiddleware, [
    body('name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, description, canvasState, status } = req.body;

        // Verify ownership
        const ownership = await db.query(
            `SELECT p.id FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.firebase_uid = $2`,
            [id, req.user.uid]
        );

        if (ownership.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const result = await db.query(
            `UPDATE projects SET 
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         canvas_state = COALESCE($3, canvas_state),
         status = COALESCE($4, status),
         updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
            [name, description, canvasState, status, id]
        );

        res.json({ project: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const result = await db.query(
            `DELETE FROM projects p
       USING users u
       WHERE p.user_id = u.id AND p.id = $1 AND u.firebase_uid = $2
       RETURNING p.id`,
            [id, req.user.uid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted' });
    } catch (error) {
        next(error);
    }
});

// Deploy project
router.post('/:id/deploy', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get project
        const projectResult = await db.query(
            `SELECT p.* FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.firebase_uid = $2`,
            [id, req.user.uid]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // TODO: Implement actual deployment to Cloud Run
        // For now, simulate deployment
        const deployedUrl = `https://${id.slice(0, 8)}.primeengine.app`;

        await db.query(
            `UPDATE projects SET status = 'deployed', deployed_url = $1, updated_at = NOW()
       WHERE id = $2`,
            [deployedUrl, id]
        );

        // Log deployment
        await db.query(
            `INSERT INTO deployments (id, project_id, url, status, created_at)
       VALUES ($1, $2, $3, 'success', NOW())`,
            [uuidv4(), id, deployedUrl]
        );

        res.json({
            message: 'Deployed successfully',
            url: deployedUrl
        });
    } catch (error) {
        next(error);
    }
});

// Export to GitHub
router.post('/:id/export', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get project
        const projectResult = await db.query(
            `SELECT p.* FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.firebase_uid = $2`,
            [id, req.user.uid]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // TODO: Implement actual GitHub export
        // For now, simulate export
        const repoUrl = `https://github.com/user/${projectResult.rows[0].name.toLowerCase().replace(/\s+/g, '-')}`;

        res.json({
            message: 'Exported to GitHub',
            repoUrl
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
