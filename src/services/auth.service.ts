import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";
import { IUser } from "../models/user.model.js";
import { ErrorResponse, SuccessResponse } from "../utils/responseHandler.js";

@injectable()
export class AuthService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {}

  register = async (userData: IUser) => {
    try {
      // Check if the user already exists
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        return new ErrorResponse("User already exists");
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      // Create the user
      const user = await this.userRepository.create(userData);

      const successResponseData = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      return new SuccessResponse("User registered successfully", successResponseData);
    } catch (error) {
      return new ErrorResponse("Error registering user", error.message);
    }
  }

  login = async (email: string, password: string) => {
    try {
      // Find the user by email
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return new ErrorResponse("Invalid credentials");
      }

      // Check password validity
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return new ErrorResponse("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      const data = {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };

      return new SuccessResponse("Login successful", data);
    } catch (error) {
      return new ErrorResponse("Error logging in", error.message);
    }
  }
}
