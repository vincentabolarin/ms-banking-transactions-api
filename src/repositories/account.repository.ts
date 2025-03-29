import { injectable } from "tsyringe";
import Account, { IAccount } from "../models/account.model";
import mongoose from "mongoose";

@injectable()
export class AccountRepository {
  async create(accountData: IAccount) {
    return await Account.create(accountData);
  }

  async findByUserId(userId: mongoose.Schema.Types.ObjectId) {
    return await Account.findOne({ userId });
  }
}
