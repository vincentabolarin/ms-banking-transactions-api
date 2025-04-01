import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller.js";
import { validateLogin, validateRegistration } from "../middlewares/userValidation.middleware.js";

const router = Router();
const authController = container.resolve(AuthController);

router.post("/register", validateRegistration, authController.register);
router.post("/login", validateLogin, authController.login);

export default router;
