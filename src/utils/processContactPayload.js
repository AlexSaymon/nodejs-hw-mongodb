const processName = (firstName, secondName) => {
  if (!firstName || !secondName) return null;
  return firstName + ' ' + secondName;
};

export const processContactPayload = ({
  firstName,
  secondName,
  ...payload
}) => ({
  ...payload,
  ...(processName(firstName, secondName)
    ? { name: processName(firstName, secondName) }
    : {}),
});
