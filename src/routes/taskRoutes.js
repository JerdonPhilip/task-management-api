import { Router } from "express";
import { getTasks, createTask, completeTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

// All task routes are now user-specific
router.get("/:username", getTasks);
router.post("/:username", createTask);
router.put("/:username/:taskId/complete", completeTask);
router.delete("/:username/:taskId", deleteTask);

export default router;
