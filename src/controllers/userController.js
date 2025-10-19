import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { readJSONAsync, writeJSONAsync } from "../config/database.js";
import { calculateLevelUp } from "../utils/gameLogic.js";
import { Dropbox } from "dropbox";
import fetch from "node-fetch";

const dataPath = path.resolve("src/data/users.json");
const isLocal = process.env.NODE_ENV === "development";
const dbx = !isLocal ? new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch }) : null;

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFile = `${username}_tasks.json`;

        const newUser = {
            username,
            password,
            level: 1,
            experience: 0,
            gold: 100,
            health: 100,
            maxHealth: 100,
            class: "Novice",
            completedQuests: 0,
            tasks: []
        };

        if (isLocal) {
            // Local JSON file creation
            fs.writeFileSync(path.join(dataPath, userFile), JSON.stringify(newUser, null, 2));
        } else {
            // Dropbox JSON upload
            await dbx.filesUpload({
                path: `/data/${userFile}`,
                contents: JSON.stringify(newUser, null, 2),
                mode: { ".tag": "overwrite" }
            });
        }

        res.status(201).json({ message: "User registered", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFile = `${username}_tasks.json`;

        let userData;

        if (isLocal) {
            const filePath = path.join(dataPath, userFile);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: "User not found" });
            }
            userData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        } else {
            try {
                const file = await dbx.filesDownload({ path: `/data/${userFile}` });
                const buffer = file.result.fileBinary || file.result.fileBlob;
                userData = JSON.parse(buffer.toString());
            } catch {
                return res.status(404).json({ error: "User not found" });
            }
        }

        if (userData.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const users = await readJSONAsync("users");
        const userId = req.params.userId;

        if (!users[userId]) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(users[userId]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createUser = async (req, res) => {
    try {
        const users = await readJSONAsync("users");
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
            await writeJSONAsync("users", users);
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
