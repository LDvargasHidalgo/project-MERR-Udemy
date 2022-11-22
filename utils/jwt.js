const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");

// create function for acces token
function createAccesToken(user) {
  const expToken = new Date();
  expToken.setHours(expToken.getHours() + 3);

  const payload = {
    token_type: "acces",
    user_id: user._id,
    iat: Date.now(),
    exp: expToken.getTime(),
  };

  return jwt.sign(payload, JWT_SECRET_KEY);
}

//when acces token expire refresh with refreshToken
//when refresh Token expire the sesion is expired

function createRefreshToken(user) {
  const expToken = new Date();
  expToken.getMonth(expToken.getMonth() + 1);

  const payload = {
    token_type: "refresh",
    user_id: user._id,
    iat: Date.now(),
    exp: expToken.getTime(),
  };

  return jwt.sign(payload, JWT_SECRET_KEY);
}

//return data for codifiqued token

function decoded(token) {
  return jwt.decode(token, JWT_SECRET_KEY, true);
}

module.exports = {
  createAccesToken,
  createRefreshToken,
  decoded,
};
