import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiKeyMiddleware from "./middleware/apiKeyMiddleware.js";
import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3002;

const allowedOrigins = ["http://localhost:5173", "https://jerdonphilip.github.io"];

app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
        credentials: true
    })
);
app.use(morgan("dev"));
app.use(express.json());

// Protect all /api routes
app.use("/api", apiKeyMiddleware, router);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Task Management RPG API" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
