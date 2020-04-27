const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-handlebars");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".handlebars",
      layoutsDir: path.resolve("./src/views/layouts/"),
      defaultLayout: "layout",
      partialsDir: path.resolve("./src/views/partials/"),
    },
    viewPath: path.resolve("./src/views/layouts/"),
    extName: ".handlebars",
  })
);

module.exports = transporter;
