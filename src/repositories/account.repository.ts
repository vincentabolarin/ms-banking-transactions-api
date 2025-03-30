import { injectable } from "tsyringe";
import mongoose, { ClientSession } from "mongoose";
import Account, { IAccount } from "../models/account.model.js";

@injectable()
export class AccountRepository {
  async create(accountData: Partial<IAccount>) {
    return await Account.create(accountData);
  }

  async findByUserId(userId: string) {
    return await Account.findOne({ userId });
  }

  async findById(accountId: string) {
    return await Account.findById(accountId);
  }

  async updateBalance(
    accountId: string,
    amount: number,
    session?: ClientSession
  ) {
    return await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: amount } },
      { new: true, session }
    );
  }
}
