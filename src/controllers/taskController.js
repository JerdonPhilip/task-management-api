import { readUserTasks, writeUserTasks, getUser, createUser, validateCredentials } from "../config/database.js";
import { calculateQuestReward } from "../utils/gameLogic.js";

// Authentication middleware
export const authenticateUser = (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Validate username format
        if (username.length < 8 || username.length > 20) {
            return res.status(400).json({ error: "Username must be 8-20 characters long" });
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return res.status(400).json({ error: "Username can only contain letters and numbers" });
        }

        // Validate password format
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: "Authentication error" });
    }
};

// User registration
export const registerUser = (req, res) => {
    try {
        const { username, password } = req.body;

        const result = createUser(username, password);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        // Don't send password back
        const { password: _, ...userWithoutPassword } = result.user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// User login
export const loginUser = (req, res) => {
    try {
        const { username, password } = req.body;

        const result = validateCredentials(username, password);

        if (!result.valid) {
            return res.status(401).json({ error: result.error });
        }

        // Update last active
        result.user.lastActive = new Date().toISOString();

        // Don't send password back
        const { password: _, ...userWithoutPassword } = result.user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get tasks for specific user
export const getTasks = (req, res) => {
    try {
        const username = req.params.username;
        const tasks = readUserTasks(username);
        res.json(tasks);
    } catch (error) {
        console.error("Error in getTasks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Create task for specific user
export const createTask = (req, res) => {
    try {
        const username = req.params.username;
        const user = getUser(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const reward = calculateQuestReward(req.body.difficulty);

        const task = {
            id: Date.now().toString(),
            text: req.body.text,
            difficulty: req.body.difficulty || "easy",
            completed: false,
            createdAt: new Date().toISOString(),
            experience: reward.experience,
            gold: reward.gold
        };

        const tasks = readUserTasks(username);
        tasks.unshift(task);
        writeUserTasks(username, tasks);

        res.json(task);
    } catch (error) {
        console.error("Error in createTask:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Complete task for specific user
export const completeTask = async (req, res) => {
    // Add async here
    try {
        const { username, taskId } = req.params;
        const user = getUser(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const tasks = readUserTasks(username);
        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.completed) {
            return res.status(400).json({ error: "Task already completed" });
        }

        // Mark task as completed
        task.completed = true;
        task.completedAt = new Date().toISOString();

        // Update user stats
        user.experience += task.experience;
        user.gold += task.gold;
        user.completedQuests += 1;
        user.lastActive = new Date().toISOString();

        // Check for level up
        const expNeeded = user.level * 100;
        if (user.experience >= expNeeded) {
            user.level += 1;
            user.experience = user.experience - expNeeded;
            user.maxHealth += 20;
            user.health = user.maxHealth;
            user.gold += 50;
        }

        writeUserTasks(username, tasks);

        // Update user in database - FIXED LINE
        saveUser(username, user); // No need for dynamic import since you already imported it

        // Don't send password back
        const { password: _, ...userWithoutPassword } = user;
        res.json({ task, user: userWithoutPassword });
    } catch (error) {
        console.error("Error in completeTask:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete task for specific user
export const deleteTask = (req, res) => {
    try {
        const { username, taskId } = req.params;

        const tasks = readUserTasks(username);
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        writeUserTasks(username, filteredTasks);

        res.json({ success: true });
    } catch (error) {
        console.error("Error in deleteTask:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
