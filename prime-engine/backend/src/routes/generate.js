const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const db = require('../config/database');
const { generateApp } = require('../services/ai');

const router = express.Router();

// Generate app from prompt
router.post('/', authMiddleware, [
    body('prompt').trim().notEmpty().isLength({ min: 10, max: 5000 }),
    body('projectId').optional().isUUID(),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { prompt, projectId } = req.body;

        // Get user ID and credits
        const userResult = await db.query(
            'SELECT id, credits FROM users WHERE firebase_uid = $1',
            [req.user.uid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];
        const userId = user.id;

        // Check credits
        const GENERATION_COST = 10;
        if (user.credits < GENERATION_COST) {
            return res.status(403).json({ error: 'Insufficient credits for synthesis' });
        }

        // Generate app using AI
        console.log('Generating app with prompt:', prompt.substring(0, 100) + '...');
        const generatedContent = await generateApp(prompt);

        // Deduct credits
        await db.query(
            'UPDATE users SET credits = credits - $1 WHERE id = $2',
            [GENERATION_COST, userId]
        );

        let project;

        if (projectId) {
            // Update existing project
            const result = await db.query(
                `UPDATE projects SET 
           prompt = $1,
           canvas_state = $2,
           generated_code = $3,
           status = 'ready',
           updated_at = NOW()
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
                [prompt, generatedContent.canvasState, generatedContent.code, projectId, userId]
            );
            project = result.rows[0];
        } else {
            // Create new project
            const newProjectId = uuidv4();
            const projectName = generatedContent.name || 'Untitled App';

            const result = await db.query(
                `INSERT INTO projects (id, user_id, name, description, prompt, canvas_state, generated_code, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ready', NOW(), NOW())
         RETURNING *`,
                [
                    newProjectId,
                    userId,
                    projectName,
                    generatedContent.description,
                    prompt,
                    generatedContent.canvasState,
                    generatedContent.code
                ]
            );
            project = result.rows[0];
        }

        res.json({
            project,
            message: 'App generated successfully'
        });
    } catch (error) {
        console.error('Generation error:', error);
        next(error);
    }
});

module.exports = router;
