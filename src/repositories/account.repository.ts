import { injectable } from "tsyringe";
import mongoose, { ClientSession } from "mongoose";
import Account, { IAccount } from "../models/account.model.js";

@injectable()
export class AccountRepository {
  create = async (accountData: Partial<IAccount>) => {
    return await Account.create(accountData);
  };

  findByUserId = async (userId: mongoose.Types.ObjectId) => {
    return await Account.findOne({ userId });
  };

  findById = async (accountId: mongoose.Types.ObjectId) => {
    return await Account.findById(accountId);
  };

  updateBalance = async (
    accountId: mongoose.Types.ObjectId,
    amount: number,
    session?: ClientSession
  ) => {
    return await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: amount } },
      { new: true, session }
    );
  };
}
