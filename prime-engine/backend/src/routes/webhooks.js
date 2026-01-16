const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const razorpayWebhook = async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    try {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Razorpay webhook signature verification failed');
            return res.status(400).send('Invalid signature');
        }

        const event = req.body;
        console.log(`Razorpay Webhook Event: ${event.event}`);

        switch (event.event) {
            case 'payment.captured': {
                const payment = event.payload.payment.entity;
                const userId = payment.notes.userId;
                const planId = payment.notes.planId || 'pro';

                await db.query(
                    `INSERT INTO subscriptions (id, user_id, status, current_period_end, created_at)
                     VALUES ($1, $2, $3, $4, NOW())
                     ON CONFLICT (user_id) DO UPDATE SET
                       status = $3,
                       current_period_end = $4`,
                    [
                        uuidv4(),
                        userId,
                        'active',
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial/period
                    ]
                );
                break;
            }

            case 'subscription.activated':
            case 'subscription.updated': {
                const subscription = event.payload.subscription.entity;
                const userId = subscription.notes.userId;

                await db.query(
                    `UPDATE subscriptions SET
                       status = $1,
                       current_period_end = $2
                     WHERE user_id = $3`,
                    [
                        subscription.status,
                        new Date(subscription.current_end_at * 1000),
                        userId
                    ]
                );
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.event}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

module.exports = { razorpayWebhook };
