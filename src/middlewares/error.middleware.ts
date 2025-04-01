import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/responseHandler.js";
import logger from "../utils/logger.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  return res.status(err.status || 500).json(new ErrorResponse("Internal Server Error", err.message));
};

export default errorHandler;
