const bcrypt = require("bcryptjs");
const user = require("../models/user");
const User = require("../models/user");
const image = require("../utils/image");

async function getMe(req, res) {
  const { user_id } = req.user;

  const response = await User.findById(user_id);

  if (!response) {
    res.status(400).send({ msg: "user not found " });
  } else {
    res.status(200).send(response);
  }
}

async function getUsers(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await User.find();
  } else {
    response = await User.find({ active });
  }

  res.status(200).send(response);
}

//**CREATE USER*****/
async function createUser(req, res) {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const user = new User({ ...req.body, active: false });

  const hasPassword = bcrypt.hashSync(password, salt);
  user.password = hasPassword;

  // the avatar not is required then create a conditional
  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
  }

  user.save((error, userStored) => {
    if (error) {
      res.status(400).send({ msg: "error creating user " });
    } else {
      res.status(201).send(userStored);
    }
  });
}

//**********FUNCTION UPDATE USER***********/
async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  //password,  retorn encrypt password
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hashPassword;
  } else {
    delete userData.password;
  }
  //Avatar
  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    userData.avatar = imagePath;
  }
  
  User.findByIdAndUpdate({ _id: id }, userData, (error) => {
    if (error) {
      res.status(400).send({ msg: " error updating user " });
    } else {
      res.status(200).send({ msg: "user updated correctly" });
    }
  });
}

//***********DELETE USER */
async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error deleting user" });
    } else {
      res.status(200).send({ msg: "User deleted correctly" });
    }
  });
}
module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
