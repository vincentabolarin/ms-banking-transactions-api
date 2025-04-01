import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/responseHandler.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof ErrorResponse) {
    return res.status(400).json(new ErrorResponse("Error", err.message));
  }

  return res.status(500).json(new ErrorResponse("Internal Server Error"));
};
