const connection = require("../database/connection");
const mailer = require("../services/mailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Apagar imagem enviada caso usuário já esteja cadastrado
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

module.exports = {
  async register(req, res) {

    if (req.fileTypeError) {
      return res.status(400).json({ message: req.fileTypeError });
    }

    const { name, phone_number, email, password } = req.body;
    const user_img = req.file.path;

    try {
      const user = await connection("users")
        .where("email", email)
        .select("*")
        .first();

      if (user) {
        await unlinkAsync(req.file.path);
        return res.status(401).json({ message: "User is already registered " });
      }

      const id = crypto.randomBytes(4).toString("HEX");
      const hashedPassword = await bcrypt.hash(password, 10);

      await connection("users").insert({
        id,
        user_img,
        name,
        phone_number,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "Successfully registered!", id });
    } catch (error) {
      return res.status(400).json({ message: "Operation Failed", error });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await connection("users")
        .where("email", email)
        .select("*")
        .first();

      if (!user) {
        return res.status(401).json({ message: "User isn't registered!" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Wrong Password" });
      }

      // Usado para não retornar esses campos como resposta da requisição
      user.password = undefined;
      user.password_reset_token = undefined;
      user.password_reset_expires = undefined;

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });

      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      return res.status(400).json({ message: "Failed to login", error });
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await connection("users")
        .where("email", email)
        .select("*")
        .first();

      if (!user) {
        return res.status(401).json({ message: "Email isn't registered" });
      }

      const token = crypto.randomBytes(20).toString("HEX");

      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      await connection("users").where("id", user.id).update({
        password_reset_token: token,
        password_reset_expires: expirationTime,
      });

      mailer.sendMail(
        {
          from: `Vitor Pereira <${process.env.EMAIL}>`,
          to: user.email,
          subject: "Token to reset password",
          template: "forgot_password",
          context: {
            name: user.name,
            token
          }
        },
        (err) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "Failed to send email", err });
          }

          return res.status(200).send();
        }
      );
    } catch (error) {
      return res.status(503).json({ message: "Service unavailable", error });
    }
  },

  async resetPassword(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await connection("users")
        .where("email", email)
        .select("*")
        .first();

      if (!user) {
        return res.status(401).json({ message: "Email isn't registered" });
      }

      if (token !== user.password_reset_token ) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const rightNow = new Date();

      if (rightNow > user.password_reset_expires) {
        return res.status(401).json({ message: "Expired token"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection("users").where("email", email).update({
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null
      });

      return res.status(200).json({ message: "Password updated" });
    } catch (error) {
      return res.status(400).json({ message: "Fail to reset password", error });
    }
  },
};
