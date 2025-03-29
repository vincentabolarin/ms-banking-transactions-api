import { injectable } from "tsyringe";
import User from "../models/user.model";

@injectable()
export class UserRepository {
  async create(userData: any) {
    return await User.create(userData);
  }

  async findByEmail(email: string) {
    return await User.findOne({ email });
  }
}
