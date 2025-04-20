import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} from "../services/contactsServices.js";
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
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }
    const contact = await updateContact(req.params.id, req.body);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    if (!("favorite" in req.body)) {
      throw HttpError(400, "Missing field 'favorite'");
    }

    const contact = await updateStatusContact(req.params.id, req.body);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export { getAll, getById, remove, add, update, updateStatus };
