import { contactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();

  return contacts;
};

export const getContactById = async () => {
  const contactById = await contactsCollection.findById();

  return contactById;
};
