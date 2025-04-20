import Contact from "../db/models/contactModel.js";

async function listContacts() {
  return await Contact.findAll();
}

async function getContactById(id) {
  return await Contact.findByPk(id);
}

async function addContact({ name, email, phone, favorite = false }) {
  return await Contact.create({ name, email, phone, favorite });
}

async function updateContact(id, data) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.update(data);
  return contact;
}

async function removeContact(id) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

async function updateStatusContact(id, data) {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.update({ favorite: data.favorite });
  return contact;
}


export {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
