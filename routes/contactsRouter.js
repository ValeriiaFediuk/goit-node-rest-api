import express from "express";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact, 
} from "../services/contactsServices.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
});

router.get("/:contactId", async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  contact ? res.json(contact) : res.status(404).json({ message: "Not found" });
});

router.delete("/:contactId", async (req, res) => {
  const contact = await removeContact(req.params.contactId);
  contact ? res.json(contact) : res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res) => {
  const contact = await addContact(req.body);
  res.status(201).json(contact);
});

router.put("/:contactId", async (req, res) => {
  const contact = await updateContact(req.params.contactId, req.body);
  contact ? res.json(contact) : res.status(404).json({ message: "Not found" });
});

router.patch("/:contactId/favorite", async (req, res) => {
  const { favorite } = req.body;
  if (typeof favorite !== "boolean") {
    return res.status(400).json({ message: "Missing or invalid 'favorite' field" });
  }

  const contact = await updateStatusContact(req.params.contactId, { favorite });
  contact ? res.json(contact) : res.status(404).json({ message: "Not found" });
});

export default router;
