import { listContacts, getContactById, removeContact, addContact, updateContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

const getAll = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) throw HttpError(404, "Not found");
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.id);
    if (!contact) throw HttpError(404, "Not found");
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedContact = await updateContact(req.params.id, req.body);
    if (!updatedContact) throw HttpError(404, "Not found");
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export { getAll, getById, remove, add, update };
