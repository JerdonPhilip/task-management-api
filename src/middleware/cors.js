// CORS configuration middleware
export const corsConfig = (req, res, next) => {
    // CORS is already handled by the cors package
    // This is just a placeholder for custom CORS logic if needed
    next();
};

export default corsConfig;
