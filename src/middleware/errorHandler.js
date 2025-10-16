// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Default error
    let error = {
        message: "Internal Server Error",
        status: 500
    };

    // Handle different types of errors
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        error = {
            message: "Invalid JSON payload",
            status: 400
        };
    } else if (err.message && err.status) {
        error = {
            message: err.message,
            status: err.status
        };
    }

    res.status(error.status).json({
        error: {
            message: error.message,
            status: error.status,
            timestamp: new Date().toISOString()
        }
    });
};

export default errorHandler;
