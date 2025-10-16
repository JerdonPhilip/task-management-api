// Simple authentication middleware (placeholder)
export const auth = (req, res, next) => {
    // For now, just pass through
    // In a real app, you'd validate JWT tokens or session cookies here
    next();
};

export default auth;
