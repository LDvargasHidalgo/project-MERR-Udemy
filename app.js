const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {API_VERSION}=require("./constants");


const app = express();

//Import routings
const authRoutes = require("./router/auth");

//configuracion del body Parse para poder mandar contenido json, 
// Nuestro servidor ya es capaz de recibir json en el body de la peticion
app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());

// Configure static folder 
app.use(express.static("uploads"));

//configurar las cors de HTTP
app.use(cors());

//Configuracion de las rutas
app.use(`/api/${API_VERSION}`, authRoutes);

module.exports = app;