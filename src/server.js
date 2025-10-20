// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import axios from "axios";
// import apiKeyMiddleware from "./middleware/apiKeyMiddleware.js";
// import userRoutes from "./routes/userRoutes.js"; // Add this import

// const app = express();
// const PORT = process.env.PORT || 3002;

// const allowedOrigins = ["http://localhost:5173", "https://jerdonphilip.github.io"];

// app.use(helmet());
// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("CORS not allowed"));
//             }
//         },
//         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
//         credentials: true
//     })
// );
// app.use(morgan("dev"));
// app.use(express.json());

// // In-memory storage for heroes
// let heroes = [];

// // --- Proxy endpoints for frontend ---
// app.post("/frontend/heroes", async (req, res) => {
//     try {
//         const { name, password } = req.body;

//         // Input validation
//         if (!name || !password) {
//             return res.status(400).json({ error: "Name and password required" });
//         }

//         // Check if hero already exists
//         const exists = heroes.find(h => h.name === name);
//         if (exists) {
//             return res.status(400).json({ error: "Hero already exists" });
//         }

//         // Create new hero directly (no internal API call needed)
//         const newHero = {
//             id: heroes.length + 1,
//             name,
//             password,
//             level: 1,
//             experience: 0,
//             health: 100,
//             gold: 0,
//             completedQuests: 0
//         };
//         heroes.push(newHero);

//         res.json(newHero);
//     } catch (err) {
//         console.error("Error creating hero:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// app.post("/frontend/login", async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Input validation
//         if (!username || !password) {
//             return res.status(400).json({ error: "Username and password required" });
//         }

//         // Find hero
//         const hero = heroes.find(h => h.name === username && h.password === password);
//         if (!hero) {
//             return res.status(400).json({ error: "Invalid hero name or secret code" });
//         }

//         res.json(hero);
//     } catch (err) {
//         console.error("Error during login:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// // --- Protected API routes ---
// app.use("/api", apiKeyMiddleware);

// // Use the actual user routes
// app.use("/api/users", userRoutes);

// // Simple test endpoints (keep these or remove if you want only the userRoutes)
// app.post("/api/heroes", (req, res) => {
//     const { name, password } = req.body;
//     if (!name || !password) return res.status(400).json({ error: "Name and password required" });

//     const exists = heroes.find(h => h.name === name);
//     if (exists) return res.status(400).json({ error: "Hero already exists" });

//     const newHero = { id: heroes.length + 1, name, password };
//     heroes.push(newHero);
//     res.json(newHero);
// });

// app.post("/api/login", (req, res) => {
//     const { username, password } = req.body;
//     const hero = heroes.find(h => h.name === username && h.password === password);
//     if (!hero) return res.status(400).json({ error: "Invalid hero name or secret code" });
//     res.json(hero);
// });

// app.get("/api/protected", (req, res) => {
//     res.json({ message: "You have access because you have the API key" });
// });

// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to Task Management RPG API" });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// // Add this near the top of server.js
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
// });

// // Add error handling middleware at the end
// app.use((err, req, res, next) => {
//     console.error("Unhandled error:", err);
//     res.status(500).json({ error: "Internal server error" });
// });
// server.js - Update the frontend routes to use your userController
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiKeyMiddleware from "./middleware/apiKeyMiddleware.js";
import { registerUser, loginUser } from "./controllers/userController.js"; // Import the controllers

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

// --- Proxy endpoints for frontend ---
// These now directly use your userController
app.post("/frontend/heroes", async (req, res) => {
    try {
        // Use your actual registerUser controller
        await registerUser(req, res);
    } catch (err) {
        console.error("Frontend heroes error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/frontend/login", async (req, res) => {
    try {
        // Use your actual loginUser controller
        await loginUser(req, res);
    } catch (err) {
        console.error("Frontend login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// --- Protected API routes ---
app.use("/api", apiKeyMiddleware);

// Your existing API routes can stay here if needed
app.get("/api/protected", (req, res) => {
    res.json({ message: "You have access because you have the API key" });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Task Management RPG API" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
