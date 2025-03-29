import mongoose from "mongoose";

export interface User extends mongoose.Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<User>("User", UserSchema);
