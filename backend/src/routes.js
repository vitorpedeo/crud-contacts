const express = require("express");
const router = express.Router();
const { celebrate, Segments } = require("celebrate");

const validation = require("./services/validation");
const upload = require("./services/upload");
const authMiddleware = require("./services/auth");

const UserController = require("./controllers/UserController");
const ContactController = require("./controllers/ContactController");

//User routes

router.post(
  "/api/register",
  upload.single("user_img"),
  celebrate({
    [Segments.BODY]: validation.userRegistration,
  }),
  UserController.register
);

router.post(
  "/api/login",
  celebrate({
    [Segments.BODY]: validation.userLogin,
  }),
  UserController.login
);

router.post(
  "/api/forgot_password",
  celebrate({
    [Segments.BODY]: validation.userForgotPassword,
  }),
  UserController.forgotPassword
);

router.post(
  "/api/reset_password",
  celebrate({
    [Segments.BODY]: validation.userResetPassword,
  }),
  UserController.resetPassword
);

//Contacts routes

router.get("/api/list_contacts", authMiddleware, ContactController.list);

router.post(
  "/api/new_contact",
  authMiddleware,
  upload.single("contact_img"),
  celebrate({
    [Segments.BODY]: validation.contactRegistration,
  }),
  ContactController.create
);

router.put(
  "/api/update_contact/:id",
  authMiddleware,
  upload.single("contact_img"),
  celebrate({
    [Segments.BODY]: validation.contactRegistration,
  }),
  ContactController.update
);

router.delete(
  "/api/delete_contact/:id",
  authMiddleware,
  ContactController.delete
);

module.exports = router;
