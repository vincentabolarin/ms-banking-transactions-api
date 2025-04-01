import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { AccountService } from "../services/account.service.js";
import { IUser } from "../models/user.model.js";

interface AccountRequest extends Request {
  user?: IUser;
}

@injectable()
export class AccountController {
  constructor(@inject(AccountService) private accountService: AccountService) {}

  createAccount = async (req: AccountRequest, res: Response, next: NextFunction) => {
    try {
      const { currency } = req.body;
      const userId = req.user.id;

      const result = await this.accountService.createAccount(userId, currency);

      if (!result.success) {
        switch (result.message) {
          case "Account already exists for this user":
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

  getAccount = async (req: AccountRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await this.accountService.getAccount(userId);

      if (!result.success) {
        switch (result.message) {
          case "Account not found":
            res.status(404).json(result);
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
}
