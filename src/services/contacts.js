import { processContactPayload } from '../utils/processContactPayload.js';
import { contactsCollection } from '../db/models/contacts.js';

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

export const getAllContacts = async ({ page, perPage }) => {
  const offset = (page - 1) * perPage;

  const contactsQuery = contactsCollection.find().skip(offset).limit(perPage);

  const contactsCountQuery = contactsCollection
    .find()
    .merge(contactsQuery)
    .countDocuments();

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

export const getContactById = async (contactId) => {
  const contactById = await contactsCollection.findById(contactId);

  return contactById;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(
    processContactPayload(payload),
  );

  return contact;
};

export const upsertContact = async (contactId, payload, options = {}) => {
  const response = await contactsCollection.findByIdAndUpdate(
    contactId,
    processContactPayload(payload),
    { ...options, new: true, includeResultMetadata: true },
  );

  const contact = response.value;
  const isNew = !response.lastErrorObject.updatedExisting;

  return {
    contact,
    isNew,
  };
};

export const deleteContactById = async (contactById) => {
  const deleteContact = await contactsCollection.findByIdAndDelete(contactById);

  return deleteContact;
};
