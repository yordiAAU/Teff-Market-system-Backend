import { Router } from "express";

import {
  AuthController,
} from "../controllers/auth.controller";

import {
  validate,
} from "../middleware/validate";

import { authenticate } from "../middleware/authenticate";

import {
  registerSchema,
  loginSchema,
} from "../validation/auth.validation";



const authrouter = Router();

authrouter.post(
  "/register",
  validate(
    registerSchema
  ),
  AuthController.register
);

authrouter.post(
  "/login",
  validate(
    loginSchema
  ),
  AuthController.login
);

authrouter.post(
  "/refresh",
  AuthController.refresh
);

authrouter.post(
  "/logout",
  AuthController.logout
);

authrouter.get(
  "/me",
  authenticate,
  AuthController.me
);

export default authrouter ;