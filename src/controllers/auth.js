import { loginUser, registerUser } from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

export const registerUserController = async (req, res) => {
  const body = req.body;

  const createUser = await registerUser(body);

  res.json({
    status: 201,
    message: 'User was sucessfully created',
    data: serializeUser(createUser),
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;

  const userLoggedIn = await loginUser(body);

  res.json({
    status: 201,
    message: 'Successfully logged in an user!',
    data: serializeUser(userLoggedIn),
  });
};
