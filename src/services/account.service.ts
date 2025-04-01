import { injectable, inject } from "tsyringe";
import { AccountRepository } from "../repositories/account.repository.js";
import mongoose from "mongoose";
import { ErrorResponse, SuccessResponse } from "../utils/responseHandler.js";

@injectable()
export class AccountService {
  constructor(
    @inject(AccountRepository) private accountRepository: AccountRepository
  ) {}

  createAccount = async (
    userId: mongoose.Types.ObjectId,
    currency: string
  ) => {
    try {
      // Check if an account already exists for the user
      const existingAccount = await this.accountRepository.findByUserId(userId);
      if (existingAccount) {
        return new ErrorResponse("Account already exists for this user");
      }

      // Create the account
      const account = await this.accountRepository.create({
        userId,
        currency,
        balance: 0,
      });

      return new SuccessResponse("Account created successfully", account);
    } catch (error) {
      return new ErrorResponse("Error creating account", error.message);
    }
  }

  getAccount = async (userId: mongoose.Types.ObjectId) => {
    try {
      const account = await this.accountRepository.findByUserId(userId);
      if (!account) {
        return new ErrorResponse("Account not found");
      }
      return new SuccessResponse("Account fetched successfully", account);
    } catch (error) {
      return new ErrorResponse("Error fetching account", error.message);
    }
  }

  updateBalance = async (accountId: mongoose.Types.ObjectId, amount: number) => {
    try {
      const result = await this.accountRepository.updateBalance(accountId, amount);
      return new SuccessResponse("Balance updated successfully", result);
    } catch (error) {
      return new ErrorResponse("Error updating balance", error.message);
    }
  }
}
