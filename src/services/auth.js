import createHttpError from 'http-errors';
import { userCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from '../constants/time.js';
import { sessionCollection } from '../db/models/session.js';
import fs from 'node:fs';
import { TEMPLATES_DIR_PATH } from '../constants/path.js';
import path from 'node:path';
import { getEnv } from '../utils/getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

const resetEmailTemplate = fs
  .readFileSync(path.join(TEMPLATES_DIR_PATH, 'reset-password-email.html'))
  .toString();

const createSession = () => ({
  accessToken: crypto.randomBytes(50).toString('base64'),
  refreshToken: crypto.randomBytes(50).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TIME),
});

export const requestResetPasswordEmail = async (email) => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    { sub: user._id, email },
    getEnv(ENV_VARS.JWT_SECRET),
    { expiresIn: '5m' },
  );

  const resetPasswordLink = `${getEnv(
    ENV_VARS.APP_DOMAIN,
  )}/reset-password?token=${token}`;

  const template = Handlebars.compile(resetEmailTemplate);

  const html = template({
    user: user.name,
    link: resetPasswordLink,
  });

  await sendEmail({
    to: email,
    from: getEnv(ENV_VARS.SMTP_FROM),
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async ({ password, token }) => {
  let payload;
  try {
    payload = jwt.verify(token, getEnv(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.error(err);
    throw createHttpError(401, 'JWT token is invalid or expired');
  }

  const user = await userCollection.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
};

export const registerUser = async ({ email, name, password }) => {
  let user = await userCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await userCollection.create({ email, name, password: hashedPassword });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const passIsCorrect = await bcrypt.compare(password, user.password);

  if (!passIsCorrect) {
    throw createHttpError(401, 'Password is wrong');
  }

  await sessionCollection.deleteOne({ userId: user._id });

  const sessionCreate = await sessionCollection.create({
    ...createSession(),
    userId: user._id,
  });

  return sessionCreate;
};

export const refreshUserSession = async ({ sessionToken, sessionId }) => {
  const session = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }

  const user = await userCollection.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'User in the session not found');
  }

  await sessionCollection.findByIdAndDelete(session._id);

  const refreshSession = await sessionCollection.create({
    ...createSession(),
    userId: session.userId,
  });

  return refreshSession;
};

export const logoutUser = async ({ sessionToken, sessionId }) => {
  const logout = await sessionCollection.findByIdAndDelete({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  return logout;
};
