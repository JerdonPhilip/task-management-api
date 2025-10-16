import { readJSON, writeJSON } from "../config/database.js";
import { calculateLevelUp } from "../utils/gameLogic.js";

export const getUser = (req, res) => {
    try {
        const users = readJSON("users");
        const userId = req.params.userId;

        if (!users[userId]) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(users[userId]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createUser = (req, res) => {
    try {
        const users = readJSON("users");
        const userId = req.params.userId;

        if (!users[userId]) {
            users[userId] = {
                id: userId,
                name: req.body.name || `Adventurer_${userId}`,
                level: 1,
                experience: 0,
                gold: 100,
                health: 100,
                maxHealth: 100,
                class: "Novice",
                completedQuests: 0,
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
            writeJSON("users", users);
        }

        res.json(users[userId]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateUser = (req, res) => {
    try {
        const users = readJSON("users");
        const userId = req.params.userId;

        if (users[userId]) {
            users[userId] = {
                ...users[userId],
                ...req.body,
                lastActive: new Date().toISOString()
            };
            writeJSON("users", users);
            res.json(users[userId]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const levelUpUser = (req, res) => {
    try {
        const users = readJSON("users");
        const userId = req.params.userId;

        if (users[userId]) {
            const updatedUser = calculateLevelUp(users[userId]);
            users[userId] = updatedUser;
            writeJSON("users", users);
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
