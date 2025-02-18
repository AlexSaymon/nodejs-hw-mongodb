import { contactsCollection } from '../db/models/contacts.js';
import { userCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';

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
}) => {
  const offset = (page - 1) * perPage;
  const filtersQuery = contactsCollection.find();

  if (filter.isFavourite || filter.isFavourite === false) {
    filtersQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.type) {
    filtersQuery.where('contactType').equals(filter.type);
  }

  const contactsCountQuery = contactsCollection.find().countDocuments();

  const contactsQuery = contactsCollection
    .find()
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
  const user = await contactsCollection.findOne({
    _id: contactId,
    userId,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  return user;
};

export const createContact = async (payload, userId) => {
  const user = await userCollection.findOne({
    _id: userId,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const createContact = await contactsCollection.create({
    ...payload,
    userId: user._id,
  });

  return createContact;
};

export const upsertContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const user = await userCollection.findOne({
    _id: userId,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const filterId = { _id: contactId, userId };

  const upsertOptions = { ...options, new: true, includeResultMetadata: true };

  const response = await contactsCollection.findOneAndUpdate(
    filterId,
    payload,
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

export const deleteContactById = async (contactById) => {
  const deleteContact = await contactsCollection.findByIdAndDelete(contactById);

  return deleteContact;
};
