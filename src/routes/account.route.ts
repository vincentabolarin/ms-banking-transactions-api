import { Router } from "express";
import { container } from "tsyringe";
import { AccountController } from "../controllers/account.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateAccountCreation } from "../middlewares/accountValidation.middleware.js";

const router = Router();
const accountController = container.resolve(AccountController);

router.post("/", validateAccountCreation, authMiddleware, accountController.createAccount);
router.get("/", authMiddleware, accountController.getAccount);

export default router;
