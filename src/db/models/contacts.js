import { model, Schema } from 'mongoose';
import { TYPESOFCONTACT } from '../../constants/typesOfContact.js';

const contactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: Object.values(TYPESOFCONTACT),
      required: true,
      default: 'personal',
    },
    userId: { type: String, required: true },
    photoUrl: { type: String, default: null, required: false },
  },
  { timestamps: true, versionKey: false },
);

export const contactsCollection = model('contacts', contactsSchema);
