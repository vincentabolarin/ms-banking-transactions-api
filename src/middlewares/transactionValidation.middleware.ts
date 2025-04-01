import { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import Joi from "joi";
import mongoose from "mongoose";
import { ErrorResponse } from "../utils/responseHandler.js";

// Joi Schemas
const depositSchema = Joi.object({
  accountId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid account ID format" as any);
      }
      return value;
    })
    .required(),
  amount: Joi.number().positive().required(),
});

const withdrawalSchema = Joi.object({
  accountId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid account ID format" as any);
      }
      return value;
    })
    .required(),
  amount: Joi.number().positive().required(),
});

const transferSchema = Joi.object({
  senderAccountId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid Sender account ID format" as any);
      }
      return value;
    })
    .required(),
  receiverAccountId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid Receiver account ID format" as any);
      }
      return value;
    })
    .required(),
  amount: Joi.number().positive().required(),
});

// Sanitisation Middleware
const sanitiseDeposit = [body("amount").toFloat()];
const sanitiseWithdrawal = [body("amount").toFloat()];
const sanitiseTransfer = [body("amount").toFloat()];
const sanitiseTransactionFetch = [param("accountId").trim()];

// Joi Validation Middleware
const validateWithJoi = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json(new ErrorResponse(error.details[0].message));
      return;
    }
    next();
  };
};

// Combined Middlewares
const validateDeposit = [...sanitiseDeposit, validateWithJoi(depositSchema)];
const validateWithdrawal = [...sanitiseWithdrawal, validateWithJoi(withdrawalSchema)];
const validateTransfer = [...sanitiseTransfer, validateWithJoi(transferSchema)];

const validateTransactionFetch = [
  ...sanitiseTransactionFetch,
  (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.accountId)) {
      return res
        .status(400)
        .json(new ErrorResponse("Invalid account ID format"));
    }
    next();
  },
];

export {
  validateDeposit,
  validateWithdrawal,
  validateTransfer,
  validateTransactionFetch,
};
