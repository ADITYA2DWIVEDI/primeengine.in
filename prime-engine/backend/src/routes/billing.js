const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authMiddleware } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get subscription status
router.get('/subscription', authMiddleware, async (req, res, next) => {
    try {
        const userResult = await db.query(
            'SELECT id FROM users WHERE firebase_uid = $1',
            [req.user.uid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.json({
                subscription: null,
                plan: 'free',
                limits: {
                    projects: 3,
                    generations: 100,
                }
            });
        }

        res.json({
            subscription: result.rows[0],
            plan: 'pro',
            limits: {
                projects: -1, // unlimited
                generations: 1000,
            }
        });
    } catch (error) {
        next(error);
    }
});

// Create Razorpay order
router.post('/order', authMiddleware, async (req, res, next) => {
    try {
        const { amount, currency = 'INR', planId } = req.body;

        const userResult = await db.query(
            'SELECT id, email FROM users WHERE firebase_uid = $1',
            [req.user.uid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userResult.rows[0].id,
                planId: planId || 'pro',
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        next(error);
    }
});

// Verify payment signature
router.post('/verify', authMiddleware, async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment verified
            const userResult = await db.query(
                'SELECT id FROM users WHERE firebase_uid = $1',
                [req.user.uid]
            );

            // Update subscription in database (Real implementations use webhooks)
            // For now, we'll just acknowledge success to the frontend
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
