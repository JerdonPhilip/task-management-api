// controllers/taskController.js
import { supabase } from "../config/supabase.js";

// ---------- GET USER TASKS ----------
export const getUserTasks = async (req, res) => {
    try {
        const userId = req.params.userId;

        const { data: tasks, error } = await supabase.from("tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false });

        if (error) throw error;

        res.json(tasks || []);
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ---------- CREATE TASK ----------
export const createTask = async (req, res) => {
    try {
        const userId = req.params.userId;
        const taskData = req.body;

        const { data: task, error } = await supabase
            .from("tasks")
            .insert([
                {
                    user_id: userId,
                    ...taskData
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(task);
    } catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ---------- UPDATE TASK ----------
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const updates = req.body;

        const { data: task, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single();

        if (error) throw error;

        res.json(task);
    } catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
