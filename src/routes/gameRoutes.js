import { Router } from "express";

const router = Router();

// Placeholder for game-specific routes
router.get("/stats/:userId", (req, res) => {
    res.json({ message: "Game stats endpoint" });
});

export default router;
