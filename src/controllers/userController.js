// controllers/userController.js
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

// ---------- REGISTER USER ----------
export const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        console.log("📝 Registration attempt for:", name);

        if (!name || !password) {
            return res.status(400).json({ error: "Name and password required" });
        }

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase.from("users").select("id").eq("username", name).single();

        if (checkError && checkError.code !== "PGRST116") {
            // PGRST116 = no rows returned
            console.error("❌ Check user error:", checkError);
            return res.status(500).json({ error: "Database error" });
        }

        if (existingUser) {
            return res.status(400).json({ error: "Hero already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
                {
                    username: name,
                    name: name,
                    password_hash: hashedPassword,
                    level: 1,
                    experience: 0,
                    gold: 100,
                    health: 100,
                    max_health: 100,
                    class: "Novice",
                    completed_quests: 0
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error("❌ Insert user error:", insertError);
            return res.status(500).json({ error: "Failed to create hero" });
        }

        console.log("✅ Hero created successfully:", newUser.name);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ---------- LOGIN USER ----------
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("🔐 Login attempt for:", username);

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Find user by username
        const { data: user, error } = await supabase.from("users").select("*").eq("username", username).single();

        if (error) {
            if (error.code === "PGRST116") {
                // No user found
                return res.status(404).json({ error: "User not found" });
            }
            console.error("❌ Login query error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log("❌ Invalid password for:", username);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Update last active
        await supabase.from("users").update({ last_active: new Date().toISOString() }).eq("id", user.id);

        console.log("✅ Login successful for:", username);
        res.json(user);
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ---------- GET USER ----------
export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(500).json({ error: "Database error" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Get user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ---------- UPDATE USER ----------
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;

        const { data: user, error } = await supabase
            .from("users")
            .update({
                ...updates,
                last_active: new Date().toISOString()
            })
            .eq("id", userId)
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(500).json({ error: "Database error" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Update user error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
