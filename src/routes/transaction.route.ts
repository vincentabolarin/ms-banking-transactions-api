import { Router } from "express";
import { container } from "tsyringe";
import { TransactionController } from "../controllers/transaction.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateDeposit, validateTransfer, validateWithdrawal } from "../middlewares/transactionValidation.middleware.js";

const router = Router();
const transactionController = container.resolve(TransactionController);

router.post("/deposit", validateDeposit, authMiddleware, transactionController.deposit);
router.post("/withdraw", validateWithdrawal, authMiddleware, transactionController.withdraw);
router.post("/transfer", validateTransfer, authMiddleware, transactionController.transfer);
router.get("/:accountId", authMiddleware, transactionController.getTransactions);

export default router;
