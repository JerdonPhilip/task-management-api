import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Game data" });
});

router.post("/start", (req, res) => {
    res.json({ message: "Game started" });
});

export default router;
