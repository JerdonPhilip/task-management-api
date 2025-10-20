import fs from "fs";
import path from "path";
import { Dropbox } from "dropbox";
import fetch from "node-fetch";

const isLocal = process.env.NODE_ENV !== "production";
const dataDir = path.resolve("src/data");

// Dropbox setup (only used online)
let dbx = null;
if (!isLocal && process.env.DROPBOX_TOKEN) {
    dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
}

// ---------- LOCAL STORAGE ----------
function localRead (fileName) {
    const filePath = path.join(dataDir, `${fileName}.json`);
    if (!fs.existsSync(filePath)) return {};
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "{}");
}

function localWrite (fileName, data) {
    const filePath = path.join(dataDir, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ---------- DROPBOX STORAGE ----------
async function dropboxRead (fileName) {
    try {
        const pathDB = `/${fileName}.json`;
        const response = await dbx.filesDownload({ path: pathDB });
        const buffer = response.result.fileBinary;
        return JSON.parse(buffer.toString());
    } catch (error) {
        if (error.status === 409) return {}; // file not found
        console.error("Dropbox read error:", error);
        return {};
    }
}

async function dropboxWrite (fileName, data) {
    try {
        const pathDB = `/${fileName}.json`;
        await dbx.filesUpload({
            path: pathDB,
            contents: JSON.stringify(data, null, 2),
            mode: { ".tag": "overwrite" }
        });
    } catch (error) {
        console.error("Dropbox write error:", error);
    }
}

// ---------- CORE EXPORTS ----------
export function readJSON (fileName) {
    if (isLocal) return localRead(fileName);
    throw new Error("readJSON is synchronous; use readJSONAsync in production");
}

export function writeJSON (fileName, data) {
    if (isLocal) return localWrite(fileName, data);
    throw new Error("writeJSON is synchronous; use writeJSONAsync in production");
}

export async function readJSONAsync (fileName) {
    return isLocal ? localRead(fileName) : await dropboxRead(fileName);
}

export async function writeJSONAsync (fileName, data) {
    return isLocal ? localWrite(fileName, data) : await dropboxWrite(fileName, data);
}

// ---------- USER TASKS ----------
export function readUserTasks (userId) {
    const fileName = `${userId}_tasks`;
    return isLocal ? localRead(fileName) : [];
}

export function writeUserTasks (userId, tasks) {
    const fileName = `${userId}_tasks`;
    return isLocal ? localWrite(fileName, tasks) : null;
}

// ---------- AUTH ----------
export function validateCredentials (username, password) {
    const users = isLocal ? localRead("users") : {};
    const user = users[username];
    if (!user) return false;
    return user.password === password;
}
