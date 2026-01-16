const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors,
        });
    }

    // Database errors
    if (err.code === '23505') {
        return res.status(409).json({
            error: 'Resource already exists',
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Referenced resource not found',
        });
    }

    // Firebase auth errors
    if (err.code?.startsWith('auth/')) {
        return res.status(401).json({
            error: err.message,
        });
    }

    // Stripe errors
    if (err.type === 'StripeCardError') {
        return res.status(400).json({
            error: err.message,
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

module.exports = { errorHandler };
