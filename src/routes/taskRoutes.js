import { Router } from "express";
import { getTasks, createTask, completeTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

// All task routes are now user-specific
router.get("/:userId", getTasks);
router.post("/:userId", saveTasks);
router.post("/:username", createTask);
router.put("/:username/:taskId/complete", completeTask);
router.delete("/:username/:taskId", deleteTask);

router.get("/", (req, res) => {
    res.json({ message: "Get all tasks" });
});

router.post("/", (req, res) => {
    const newTask = req.body;
    res.json({ message: "Task created", task: newTask });
});
export default router;
