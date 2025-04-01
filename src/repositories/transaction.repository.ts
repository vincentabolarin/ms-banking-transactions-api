import { injectable } from "tsyringe";
import Transaction, { ITransaction } from "../models/transaction.model.js";
import mongoose, { ClientSession } from "mongoose";

@injectable()
export class TransactionRepository {
  create = async (transactionData: Partial<ITransaction>, session?: ClientSession) => {
    return await Transaction.create([{ ...transactionData }], { session });
  }

  findAllByAccount = async (accountId: mongoose.Types.ObjectId) => {
    return await Transaction.find({ accountId });
  }
}
