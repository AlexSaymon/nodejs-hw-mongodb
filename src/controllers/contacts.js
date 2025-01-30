import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../db/services/contacts.js';

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

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;

  const { contact } = await upsertContact(contactId, body, { upsert: false });

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  await deleteContactById(contactId);

  res.status(204).send();
};
