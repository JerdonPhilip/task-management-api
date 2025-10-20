import { Router } from "express";
import { getTasks, saveTasks, createTask, completeTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

// User-specific routes
router.get("/:userId", getTasks);
router.post("/:userId", saveTasks);

// Task operations by username
router.post("/:username/task", createTask);
router.put("/:username/:taskId/complete", completeTask);
router.delete("/:username/:taskId", deleteTask);

// Default test routes
router.get("/", (req, res) => {
    res.json({ message: "Task API is running" });
});

export default router;
