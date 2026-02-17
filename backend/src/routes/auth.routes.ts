import { Router } from "express";
import { loginUser, registerUser, logout, getCurrentUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getCurrentUser)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout)

export default router;
