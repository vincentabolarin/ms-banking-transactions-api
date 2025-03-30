import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model.js";
import { ErrorResponse } from "../utils/responseHandler.js";

interface AuthRequest extends Request {
  user?: IUser;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check if the request has an Authorization header
  if (!authHeader) {
    res.status(401).json(new ErrorResponse("Access denied; no authorization header provided"));
    return;
  }
  // Check if the token is in the correct format (Bearer <token>)
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json(new ErrorResponse("Invalid token format"));
    return;
  }
  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];  

  // Check if the token is present
  if (!token) {
    return res
      .status(401)
      .json(new ErrorResponse("Access denied; no token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json(new ErrorResponse("Invalid token"));
  }
};

export default authMiddleware;
