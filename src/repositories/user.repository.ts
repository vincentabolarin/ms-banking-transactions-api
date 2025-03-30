import { injectable } from "tsyringe";
import User, { IUser } from "../models/user.model.js";

@injectable()
export class UserRepository {
  create = async (userData: IUser) => {
    return await User.create(userData);
  }

  findByEmail = async (email: string) => {
    return await User.findOne({ email });
  }
}
