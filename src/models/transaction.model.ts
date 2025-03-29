import mongoose from "mongoose";

interface ITransaction extends mongoose.Document {
  accountId: mongoose.Schema.Types.ObjectId;
  amount: number;
  type: "deposit" | "withdrawal" | "transfer";
  createdAt: Date;
}

const TransactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ["deposit", "withdrawal", "transfer"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
