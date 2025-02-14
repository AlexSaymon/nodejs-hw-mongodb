import {
  loginUser,
  refreshUserSession,
  registerUser,
} from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

const setupSessionCookies = (session, res) => {
  res.cookie('SessionToken', session.refreshToken, {
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

export const refershUserSessionController = async (req, res) => {
  const userSession = refreshUserSession({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  setupSessionCookies(userSession, res);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: userSession.acesssToken,
    },
  });
};
