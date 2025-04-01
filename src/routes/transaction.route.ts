import { Router } from "express";
import { container } from "tsyringe";
import { TransactionController } from "../controllers/transaction.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
const transactionController = container.resolve(TransactionController);

router.post("/deposit", authMiddleware, transactionController.deposit);
router.post("/withdraw", authMiddleware, transactionController.withdraw);
router.post("/transfer", authMiddleware, transactionController.transfer);
router.get("/:accountId", authMiddleware, transactionController.getTransactions);

export default router;
