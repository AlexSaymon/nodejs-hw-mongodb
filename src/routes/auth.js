import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserValidationSchema } from '../validation/registerUserValidationSchema.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  refershUserSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { userLoginValidationSchema } from '../validation/loginUserValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(userLoginValidationSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh-session', ctrlWrapper(refershUserSessionController));

export default authRouter;
