import { getAllContacts, getContactById } from '../db/services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Sucesfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contactWithId = await getContactById(contactId);

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contactWithId,
  });
};
