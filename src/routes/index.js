import { Router } from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import gameRoutes from "./gameRoutes.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Task Management RPG API",
        version: "1.0.0",
        endpoints: {
            users: "/api/users",
            tasks: "/api/tasks",
            game: "/api/game"
        }
    });
});

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/game", gameRoutes);

export default router;
