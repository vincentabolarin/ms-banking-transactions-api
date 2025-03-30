import { injectable } from "tsyringe";
import Transaction, { ITransaction } from "../models/transaction.model";
import mongoose, { ClientSession } from "mongoose";

@injectable()
export class TransactionRepository {
  async create(transactionData: Partial<ITransaction>, session?: ClientSession) {
    return await Transaction.create([{ ...transactionData }], { session });
  }

  async findAllByAccount(accountId: mongoose.Schema.Types.ObjectId) {
    return await Transaction.find({ accountId });
  }
}
