import { contactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();

  return contacts;
};
