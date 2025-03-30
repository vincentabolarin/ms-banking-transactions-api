import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();
const authController = container.resolve(AuthController);

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
