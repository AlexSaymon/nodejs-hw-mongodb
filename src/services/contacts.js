import { contactsCollection } from '../db/models/contacts.js';
import { userCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { saveFile } from '../utils/saveFileStrategy.js';

const createPaginationMetadata = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = count > page * perPage;
  const hasPreviousPage = page !== 1 && page <= totalPages + 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const offset = (page - 1) * perPage;

  const user = await userCollection.findOne({ _id: userId });

  if (!user) {
    throw createHttpError(401, 'No user found');
  }

  const filtersQuery = contactsCollection.find({ userId });

  if (filter.isFavourite || filter.isFavourite === false) {
    filtersQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.type) {
    filtersQuery.where('contactType').equals(filter.type);
  }

  const contactsCountQuery = contactsCollection
    .find({ userId })
    .countDocuments();

  const contactsQuery = contactsCollection
    .find({ userId })
    .merge(filtersQuery)
    .skip(offset)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const [contacts, contactsCount] = await Promise.all([
    contactsQuery,
    contactsCountQuery,
  ]);

  const paginationMetadata = createPaginationMetadata(
    page,
    perPage,
    contactsCount,
  );

  return { items: contacts, ...paginationMetadata };
};

export const getContactById = async (contactId, userId) => {
  const contact = await contactsCollection.findOne({
    _id: contactId,
    userId,
  });

  return contact;
};

export const createContact = async (payload, userId, photo) => {
  const user = await userCollection.findOne({
    _id: userId,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  let photoUrl;

  if (photo) {
    photoUrl = await saveFile(photo);
  }

  const createContact = await contactsCollection.create({
    ...payload,
    ...(photoUrl ? { photoUrl } : {}),
    userId: user._id,
  });

  return createContact;
};

export const upsertContact = async (
  contactId,
  payload,
  photo,
  userId,
  options = {},
) => {
  const user = await userCollection.findOne({
    _id: userId,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  let photoUrl;

  if (photo) {
    photoUrl = await saveFile(photo);
  }

  const filterId = { _id: contactId, userId };

  const upsertOptions = { ...options, new: true, includeResultMetadata: true };

  const response = await contactsCollection.findOneAndUpdate(
    filterId,
    { ...payload, ...(photoUrl ? { photoUrl } : {}) },
    upsertOptions,
  );

  const contact = response.value;
  const isNew = !response.lastErrorObject.updatedExisting;

  return {
    contact,
    isNew,
    userId: user._id,
  };
};

export const deleteContactById = async (contactById, userId) => {
  const contact = await contactsCollection.findByIdAndDelete({
    _id: contactById,
    userId,
  });

  return contact;
};
