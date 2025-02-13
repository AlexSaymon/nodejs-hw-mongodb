import createHttpError from 'http-errors';
import { userCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from '../constants/time.js';
import { sessionCollection } from '../db/models/session.js';

const createSession = () => ({
  accessToken: crypto.randomBytes(50).toString('base64'),
  refreshToken: crypto.randomBytes(50).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TIME),
});

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
  const user = userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const passIsCorrect = await bcrypt.compare(password, user.password);

  if (!passIsCorrect) {
    throw createHttpError(401, 'Password is wrong');
  }

  const deleteSession = await sessionCollection.deleteOne({ user: user._id });

  const sessionCreate = sessionCollection.create({
    ...createSession(),
    user: user._id,
  });

  return { deleteSession, sessionCreate };
};
