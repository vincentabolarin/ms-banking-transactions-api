import mongoose from "mongoose";

export interface ITransaction extends mongoose.Document {
  accountId: mongoose.Types.ObjectId;
  senderAccountId: mongoose.Types.ObjectId;
  receiverAccountId: mongoose.Types.ObjectId;
  amount: number;
  type: "deposit" | "withdrawal" | "transfer";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  senderAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  receiverAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ["deposit", "withdrawal", "transfer"],
    required: true,
  },
}, { timestamps: true});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
