const bcrypt = require("bcryptjs");
const user = require("../models/user");
const User = require("../models/user");
const jwt = require("../utils/jwt");

function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  if (!email) res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) res.status(400).send({ msg: "El password es obligatorio" });

  // Create object user
  const user = new User({
    firstName,
    lastName,
    email: email.toLowerCase(),
    role: "user",
    active: false,
  });

  // Encrypt password
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  user.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error creating user" });
    } else {
      res.status(200).send(userStorage);
    }
  });
}

//create a function LOGIN
//we only receive the email and passeord
function login(req, res) {
  const { email, password } = req.body;

  if (!email) res.status(400).send({ msg: "Email is required" });
  if (!password) res.status(400).send({ msg: "Password is required" });

  const emailLowerCase = email.toLowerCase();

  //search if the user exists in the database
  user.findOne({ email: emailLowerCase }, (error, userStore) => {
    if (error) {
      res.status(500).send({ msg: "Server error" });
    } else {
      // function of bcrypt that compare encrypt password
      bcrypt.compare(password, userStore.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "server error" });
        } else if (!check) {
          res.status(400).send({ msg: "incorrect password" });
        } else if (!userStore.active) {
          res.status(401).send({ msg: "inactive user" });
        } else {
          // return de access tokken
          res.status(200).send({
            acces: jwt.createAccesToken(userStore),
            refresh: jwt.createRefreshToken(userStore),
          });
        }
      });
    }
  });
}

////////////////*************************** */

function refreshAccessToken(req, res) {
  const { token } = req.body; //we obtain the token

  if(!token) res.status(400).send({msg: "token required"});

  const { user_id } = jwt.decoded(token); //from the token we get an id

  // we test if there is a user with that id
  User.findOne({ _id: user_id }, (error, userStorage) => {
    if (error) {
      res.status(500).send({ msg: "server error" });
    } else {
      // if not error we create a new accessToken
      res.status(200).send({
        accessToken: jwt.createAccesToken(userStorage),
      });
    }
  });
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
