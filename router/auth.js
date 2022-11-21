const express = require("express");
const AuthController = require("../controllers/auth.js")

// create routes 
const api = express.Router();
api.post("/auth/register",AuthController.register);

// we define the login route
api.post("/auth/login", AuthController.login);

//we define the refreshToken Route
api.post("/auth/refresh_access_token",AuthController.refreshAccessToken);

module.exports = api;