const { Joi } = require("celebrate");

const userRegistration = Joi.object().keys({
  name: Joi.string().required(),
  phone_number: Joi.string().length(11).regex(/^\d+$/).required(), //Regex para aceitar apenas números
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userLogin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userForgotPassword = Joi.object().keys({
  email: Joi.string().email().required(),
});

const userResetPassword = Joi.object().keys({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  password: Joi.string().required(),
});

const contactRegistration = Joi.object().keys({
  name: Joi.string().required(),
  phone_number: Joi.string().length(11).regex(/^\d+$/).required(), //Regex para aceitar apenas números
  email: Joi.string().email().required(),
});

module.exports = {
  userRegistration,
  userLogin,
  userForgotPassword,
  userResetPassword,
  contactRegistration,
};
