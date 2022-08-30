var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const authModel = require("../models/auth");
require("dotenv").config();
const isDataContainsEmpty = require("../utility");

function generateAccessToken(user_details) {
  return jwt.sign(user_details, process.env.TOKEN_SECRET, { expiresIn: "1h" }); //60 //'1h' // '1s', '1m'
  // return jwt.sign(user_details, process.env.TOKEN_SECRET, { expiresIn: '1m' });//60 //'1h' // '1s', '1m'
}

function generateRefreshToken(username) {
  const refresh_token = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  //Update User table with this refresh token
  return refresh_token;
}

exports.loginUser = (req, res, next) => {
  const user_name = req.body.user_name;
  const password = req.body.password;

  authModel
    .validate_user(user_name, password)
    .then((response_modal) => {
      let response = {
        message: "Handling get requests to /login",
        data: "",
      };
      if (response_modal == false) {
        response.data = { user_exists: response_modal, desc: "Invalid user, Please try with correct login details" };
        res.status(401).json(response);
      } else {
        authModel.get_one_hacker(req.body.user_name).then((user_details) => {
          const token = generateAccessToken(user_details);
          const refresh_token = generateRefreshToken({
            username: req.body.user_name,
          });
          //Here I may need to set expiry of the cookie to 1 year brcause anyway the cookie stores refresh token which can expire
          res.cookie("refresh-token", refresh_token, {
            secure: true,
            maxAge: 3600000,
            httpOnly: false,
          }); //for 1 hour = 3600000 ms//
          response.data = { user_exists: response_modal, token: token };
          //The access token will be saved in memory on client side, but closing or switching the tab will lost it, so use refresh token to get new access token
          //this will help us if user closed the tab and comes back again, so we don't ske to login but use refresh token to set new access token
          //And we are good to go.
          res.status(200).json(response);
        });
      }
    })
    .catch((e) => console.log(e));
};

exports.registerUser = (req, res, next) => {
  let response = {
    message: "Handling get requests to /resgister",
    data: "",
  };

  data = {
    name: req.body.name.trim(),
    user_name: req.body.user_name.trim(),
    password: bcrypt.hashSync(req.body.password, 8),
    user_type: req.body.user_type.trim(),
  };
  if (isDataContainsEmpty(data)) {
    response.data = { desc: "Empty or null values are not allowed" };
    res.status(409).json(response);
  } else {
    console.log("resgistering user...........");

    authModel
      .register_hacker(data)
      .then((response_modal) => {
        if (response_modal == false) {
          response.data = {
            duplicate: true,
            desc: "Username is taken, please try other unique_name",
          };
          res.status(409).json(response);
        } else {
          response.data = {
            duplicate: false,
            desc: "user registered successfully",
          };
          res.status(200).json(response);
        }
      })
      .catch((e) => {
        console.log(e)
    });
  }
};

exports.get_refresh_token = (req, res, next) => {
  //check if refresh tocken is sent by browser in cookies, if not the cookie may have expired, so throw 401 and client should logout.

  refresh_token_from_client = req.cookies["refresh-token"];
  refresh_token_from_DB = "get refresh token for the user from DB";
  //if the tokens are matched
  //then verify the refresh token
  //if refresh token has expired then return 401
  //if refresh token is active then generate a new jwt access token which will be sent to cliesnt as payload,
  //generate new refresh token save it to DB and set cookies of client with this new refresh token.
};
