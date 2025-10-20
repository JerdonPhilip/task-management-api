import { Router } from "express";
import { registerUser, loginUser, getUser, createUser, updateUser, levelUpUser } from "../controllers/userController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:userId", getUser);
router.post("/:userId", createUser);
router.put("/:userId", updateUser);
router.post("/:userId/levelup", levelUpUser);

export default router;
