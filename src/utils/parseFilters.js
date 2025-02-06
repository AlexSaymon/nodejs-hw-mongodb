import { TYPESOFCONTACT } from '../constants/typesOfContact';

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};

const parseTypeOfContact = (string) => {
  if (Object.values(TYPESOFCONTACT).includes(string)) return string;
};

export const parseFilters = (filter) => {
  return {
    isFavourite: parseBoolean(filter.isFavourite),
    contactType: parseTypeOfContact(filter.contactType),
  };
};
