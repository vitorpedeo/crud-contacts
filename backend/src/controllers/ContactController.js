const connection = require("../database/connection");

//Apagar imagem enviada caso haja um update ou delete
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

module.exports = {
  async list(req, res) {
    const { userId } = req;

    try {
      const contacts = await connection("contacts")
        .where("user_id", userId)
        .select("*");

      return res.status(200).json(contacts);
    } catch (error) {
      return res.status(400).json({ message: "Couldn't list your contacts!" });
    }
  },

  async create(req, res) {
    if (req.fileTypeError) {
      return res.status(400).json({ message: req.fileTypeError });
    }

    const { userId } = req;
    const contact_img = req.file.path;
    const { name, phone_number, email } = req.body;

    try {
      await connection("contacts").insert({
        contact_img,
        name,
        phone_number,
        email,
        user_id: userId,
      });

      return res.status(201).json({ message: "Contact created!" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Couldn't create a new contact", error });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { userId } = req;
    const contact_img = req.file.path;
    const { name, phone_number, email } = req.body;

    if (req.fileTypeError) {
      return res.status(400).json({ message: req.fileTypeError });
    }

    try {
      const contact = await connection("contacts")
        .where("id", id)
        .select("*")
        .first();

      if (contact.user_id !== userId) {
        return res.status(401).json({ message: "Not allowed" });
      }

      await connection("contacts").where("id", id).update({
        contact_img,
        name,
        phone_number,
        email,
      });

      const contactUpdated = await connection("contacts")
        .where("id", id)
        .select("*")
        .first();

      return res.json({ message: "Contact updated!", contact_updated: contactUpdated });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Couldn't update contact", error });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    const { userId } = req;

    try {
      const contact = await connection("contacts")
        .where("id", id)
        .select("*")
        .first();

      if (contact.user_id !== userId) {
        return res.status(401).json({ message: "Not allowed" });
      }

      unlinkAsync(contact.contact_img);

      await connection("contacts").where("id", id).del();

      return res.status(200).json({ message: "Contact deleted!" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Couldn't delete contact", error });
    }
  },
};
