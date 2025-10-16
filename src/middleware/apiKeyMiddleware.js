// middleware/apiKeyMiddleware.js
export default function apiKeyMiddleware (req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "Forbidden" });
    }

    next();
}
