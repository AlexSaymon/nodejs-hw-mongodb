export const serializeUser = (user) => ({
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  _id: user._id,
});
