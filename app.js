const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const app = express();

//Import routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const courseRoutes = require("./router/course");

//configuracion del body Parse para poder mandar contenido json,
// Nuestro servidor ya es capaz de recibir json en el body de la peticion
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());

// Configure static folder
app.use(express.static("uploads"));

//configurar las cors de HTTP
app.use(cors());

//Configuracion de las rutas
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
module.exports = app;
