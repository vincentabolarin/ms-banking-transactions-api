import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { AuthService } from "../services/auth.service.js";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      if (!result.success) {
        switch (result.message) {
          case "User already exists":
            res.status(409).json(result);
            break;

          default:
            res.status(500).json(result);
            break;
        }
      } else {
        res.status(201).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);
      if (!result.success) {
        switch (result.message) {
          case "Invalid credentials":
            res.status(401).json(result);
            break;

          default:
            res.status(500).json(result);
            break;
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
}
