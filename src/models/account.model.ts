import mongoose from "mongoose";

export interface IAccount extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>("Account", AccountSchema);
