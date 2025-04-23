import Contact from "../db/models/contactModel.js";

async function listContacts(ownerId) {
  return await Contact.findAll({ where: { owner: ownerId } });
}

async function getContactById(id, ownerId) {
  return await Contact.findOne({ where: { id, owner: ownerId } });
}


async function addContact({ name, email, phone, favorite = false }, ownerId) {
  return await Contact.create({ name, email, phone, favorite, owner: ownerId });
}


async function updateContact(id, data, ownerId) {
  const contact = await Contact.findOne({ where: { id, owner: ownerId } });
  if (!contact) return null;
  await contact.update(data);
  return contact;
}


async function removeContact(id, ownerId) {
  const contact = await Contact.findOne({ where: { id, owner: ownerId } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
}


async function updateStatusContact(id, data, ownerId) {
  const contact = await Contact.findOne({ where: { id, owner: ownerId } });
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
