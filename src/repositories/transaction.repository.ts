import { injectable } from "tsyringe";
import Transaction, { ITransaction } from "../models/transaction.model";
import mongoose from "mongoose";

@injectable()
export class TransactionRepository {
  async create(transactionData: ITransaction) {
    return await Transaction.create(transactionData);
  }

  async findAllByAccount(accountId: mongoose.Schema.Types.ObjectId) {
    return await Transaction.find({ accountId });
  }
}
