import { TYPESOFCONTACT } from '../constants/typesOfContact.js';

const parseBoolean = (string) => {
  return ['true', 'false'].includes(string) ? JSON.parse(string) : undefined;
};

const parseTypeOfContact = (string) => {
  if (Object.values(TYPESOFCONTACT).includes(string)) return string;
};

export const parseFilters = (filter = {}) => {
  return {
    isFavourite: parseBoolean(filter.isFavourite),
    contactType: parseTypeOfContact(filter.contactType),
  };
};
