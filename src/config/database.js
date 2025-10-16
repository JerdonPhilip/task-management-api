import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize main users file
const initializeUsersFile = () => {
    const usersFilePath = path.join(dataDir, "users.json");
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, "{}");
    }
};

initializeUsersFile();

// User-specific task files
export const getUserTasksFilePath = username => {
    const safeUsername = username.toLowerCase().replace(/[^a-z0-9]/g, "");
    return path.join(dataDir, `${safeUsername}_tasks.json`);
};

export const readJSON = filename => {
    try {
        const filePath = path.join(dataDir, `${filename}.json`);
        if (!fs.existsSync(filePath)) {
            return {};
        }
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}.json:`, error);
        return {};
    }
};

export const writeJSON = (filename, data) => {
    try {
        const filePath = path.join(dataDir, `${filename}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}.json:`, error);
        throw error;
    }
};

// User-specific task operations
export const readUserTasks = username => {
    try {
        const filePath = getUserTasksFilePath(username);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading tasks for ${username}:`, error);
        return [];
    }
};

export const writeUserTasks = (username, tasks) => {
    try {
        const filePath = getUserTasksFilePath(username);
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing tasks for ${username}:`, error);
        throw error;
    }
};

// User management
export const getUser = username => {
    const users = readJSON("users");
    const safeUsername = username.toLowerCase();
    return users[safeUsername] || null;
};

export const saveUser = (username, userData) => {
    const users = readJSON("users");
    const safeUsername = username.toLowerCase();
    users[safeUsername] = {
        ...userData,
        username: username, // Store original username
        safeUsername: safeUsername,
        createdAt: userData.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
    };
    writeJSON("users", users);
    return users[safeUsername];
};

export const validateCredentials = (username, password) => {
    const users = readJSON("users");
    const safeUsername = username.toLowerCase();
    const user = users[safeUsername];

    if (!user) {
        return { valid: false, error: "User not found" };
    }

    // In a real app, you'd use proper password hashing
    // For now, we'll do simple comparison
    if (user.password !== password) {
        return { valid: false, error: "Invalid password" };
    }

    return { valid: true, user };
};

export const createUser = (username, password) => {
    const users = readJSON("users");
    const safeUsername = username.toLowerCase();

    if (users[safeUsername]) {
        return { success: false, error: "User already exists" };
    }

    const newUser = {
        id: safeUsername,
        username: username,
        safeUsername: safeUsername,
        password: password, // In real app, hash this!
        name: username, // Character name
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

    users[safeUsername] = newUser;
    writeJSON("users", users);

    // Initialize empty tasks file for new user
    writeUserTasks(username, []);

    return { success: true, user: newUser };
};
