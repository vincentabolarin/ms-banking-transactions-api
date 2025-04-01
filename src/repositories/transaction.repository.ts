import { injectable } from "tsyringe";
import Transaction, { ITransaction } from "../models/transaction.model.js";
import mongoose, { ClientSession } from "mongoose";

@injectable()
export class TransactionRepository {
  create = async (transactionData: Partial<ITransaction>, session?: ClientSession) => {
    return await Transaction.create([{ ...transactionData }], { session });
  }

  findAllByAccount = async (accountId: mongoose.Types.ObjectId, skip: number, limit: number) => {
    const transactions = await Transaction.find({ accountId }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const transactionCount = await Transaction.countDocuments({ accountId });

    return { transactions, transactionCount };
  }
}
