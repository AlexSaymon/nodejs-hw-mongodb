import createHttpError from 'http-errors';
import { contactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();

  return contacts;
};

export const getContactById = async (contactId) => {
  const contactById = await contactsCollection.findById(contactId);

  if (!contactById) {
    throw new createHttpError(404, 'Contact not found');
  }

  return contactById;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);

  return contact;
};

export const upsertContact = async (contactId, payload, options = {}) => {
  const response = await contactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { ...options, isNew: true, includeResultMetadata: true },
  );

  const contact = response.value;
  const isNew = !response.lastErrorObject.updatedExisting;

  if (!contact) {
    throw new createHttpError(404, 'Contact not found');
  }

  return {
    contact,
    isNew,
  };
};

export const deleteContactById = async (contactById) => {
  const deleteContact = await contactsCollection.findByIdAndDelete(contactById);

  if (!deleteContact) {
    throw new createHttpError(404, 'Contact not found');
  }
};
