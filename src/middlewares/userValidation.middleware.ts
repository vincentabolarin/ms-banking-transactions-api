import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import Joi from "joi";
import { ErrorResponse } from "../utils/responseHandler.js";

// Joi validation schemas
const registrationSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

// Middleware to sanitise inputs
const sanitizeRegistration = [
  body("firstName").trim().escape(),
  body("lastName").trim().escape(),
  body("email").trim().normalizeEmail(),
];

const sanitizeLogin = [body("email").trim().normalizeEmail()];

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
const validateRegistration = [
  ...sanitizeRegistration,
  validateWithJoi(registrationSchema),
];

const validateLogin = [...sanitizeLogin, validateWithJoi(loginSchema)];

export { validateRegistration, validateLogin };
