import { Router } from "express";
import { registerUser, loginUser, authenticateUser } from "../controllers/taskController.js";

const router = Router();

// Authentication routes
router.post("/register", authenticateUser, registerUser);
router.post("/login", authenticateUser, loginUser);

export default router;
