import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || ["http://localhost:5173", "https://yourusername.github.io"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Task Management RPG API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            api: "/api",
            users: "/api/users",
            tasks: "/api/users/:username/tasks"
        },
        documentation: `http://localhost:${PORT}/api`
    });
});

// ✅ FIXED: 404 handler - removed the "*" that was causing the error
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: ["GET /", "GET /health", "POST /api/users/register", "POST /api/users/login", "GET /api/users/:username/tasks", "POST /api/users/:username/tasks", "PUT /api/users/:username/tasks/:taskId/complete", "DELETE /api/users/:username/tasks/:taskId"]
    });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Task Management API running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📚 API: http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
});
