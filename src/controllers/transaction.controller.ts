import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { TransactionService } from "../services/transaction.service.js";
import mongoose from "mongoose";

@injectable()
export class TransactionController {
  constructor(
    @inject(TransactionService) private transactionService: TransactionService
  ) {}

  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, amount } = req.body;
      const result = await this.transactionService.deposit(
        accountId,
        amount
      );
      if (!result.success) {
        switch (result.message) {
          case "Deposit amount must be greater than zero":
            res.status(409).json(result);
            break;

          default:
            res.status(500).json(result);
            break;
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, amount } = req.body;
      const result = await this.transactionService.withdraw(
        accountId,
        amount
      );
      if (!result.success) {
        switch (result.message) {
          case "Withdrawal amount must be greater than zero":
            res.status(409).json(result);
            break;
          
          case "Account does not exist":
            res.status(404).json(result);
            break;
          
          case "Insufficient funds":
            res.status(409).json(result);
            break;

          default:
            res.status(500).json(result);
            break;
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { senderAccountId, receiverAccountId, amount } = req.body;
      const result = await this.transactionService.transfer(
        senderAccountId,
        receiverAccountId,
        amount
      );
      
      switch (result.message) {
        case "Transfer amount must be greater than zero":
          res.status(409).json(result);
          break;
        
        case "Sender account does not exist":
          res.status(404).json(result);
          break;
        
        case "Receiver account does not exist":
          res.status(404).json(result);
          break;
        
        case "Sender and Receiver accounts must be different":
          res.status(409).json(result);
          break;
        
        case "Insufficient funds":
          res.status(409).json(result);
          break;

        default:
          res.status(200).json(result);
          break;
      }
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId } = req.params;
      const result = await this.transactionService.getTransactions(
        new mongoose.Schema.Types.ObjectId(accountId)
      );
      
      switch (result.message) {
        case "Account does not exist":
          res.status(404).json(result);
          break;
        
        case "No transaction found for this account":
          res.status(404).json(result);
          break;
      }
    } catch (error) {
      next(error);
    }
  }
}
