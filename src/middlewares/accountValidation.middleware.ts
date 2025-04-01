import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import Joi from "joi";
import { ErrorResponse } from "../utils/responseHandler.js";

// Joi validation schemas
const accountCreationSchema = Joi.object({
  currency: Joi.string().trim().valid("NGN", "USD", "EUR").required(),
});

// Middleware to sanitise inputs
const sanitizeAccountCreation = [
  body("currency").trim().escape(),
];

// Middleware to validate inputs
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

// Combined middlewares
const validateAccountCreation = [
  ...sanitizeAccountCreation,
  validateWithJoi(accountCreationSchema),
];

export { validateAccountCreation };
