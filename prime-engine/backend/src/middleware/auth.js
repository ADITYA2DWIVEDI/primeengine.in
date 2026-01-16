const admin = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
        };

        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Optional auth - allows both authenticated and unauthenticated requests
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name,
            };
        }

        next();
    } catch (error) {
        next();
    }
};

// Role-based access control
const requireRole = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Get user role from database
        const db = require('../config/database');
        const result = await db.query(
            'SELECT role FROM users WHERE firebase_uid = $1',
            [req.user.uid]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'User not found' });
        }

        const userRole = result.rows[0].role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        req.userRole = userRole;
        next();
    };
};

module.exports = { authMiddleware, optionalAuth, requireRole };
