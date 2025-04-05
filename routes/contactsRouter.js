import express from "express";
import { getAll, getById, remove, add, update } from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.delete("/:id", remove);
router.post("/", validateBody(contactAddSchema), add);
router.put("/:id", validateBody(contactUpdateSchema), update);

export default router;
