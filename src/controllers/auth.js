import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

const setupSessionCookies = (session, res) => {
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerUserController = async (req, res) => {
  const { body } = req;

  const createUser = await registerUser(body);

  res.json({
    status: 201,
    message: 'User was sucessfully created',
    data: serializeUser(createUser),
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;

  const userSession = await loginUser(body);
  setupSessionCookies(userSession, res);

  res.json({
    status: 201,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const userSession = await refreshUserSession({
    sessionToken: req.cookies.sessionToken,
    sessionId: req.cookies.sessionId,
  });

  setupSessionCookies(userSession, res);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');

  res.status(204).send();
};
