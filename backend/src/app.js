require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const { errors } = require("celebrate");

const routes = require("./routes");

app.use(cors());
app.use(express.json());

//Permite o acesso do frontend das imagens salvas
//Rota: http://localhost:5000/uploads/nome_da_imagem
app.use("/src/uploads", express.static("./src/uploads"));

app.use(routes);

app.use(errors());

module.exports = app;
