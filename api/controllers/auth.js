var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const authModel = require("../models/auth");
require("dotenv").config();
const isDataContainsEmpty = require("../utility");

function generateAccessToken(user_details) {
  return jwt.sign(user_details, process.env.TOKEN_SECRET, { expiresIn: "10m" }); //60 //'1h' // '1s', '1m'
}

function generateRefreshToken(username) {
  const refresh_token = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  return refresh_token;
}

exports.loginUser = (req, res, next) => {
  const user_name = req.body.user_name;
  const password = req.body.password;

  authModel
    .validate_user(user_name, password)
    .then((response_modal) => {
      let response = {
        message: "Handling post requests to /login",
        data: "",
      };
      if (response_modal == false) {
        response.data = {
          user_exists: response_modal,
          desc: "Invalid user, Please try with correct login details",
        };
        res.status(401).json(response);
      } else {
        authModel.get_one_hacker(req.body.user_name).then((user_details) => {
          const token = generateAccessToken(user_details);
          const refresh_token = generateRefreshToken({
            username: req.body.user_name,
          });
          //Here I may need to set expiry of the cookie to 1 year brcause anyway the cookie stores refresh token which can expire
          //   res.cookie("refresh_token", 'refresh_token_value', { sameSite: 'none', secure: true})
          res.cookie("refresh_token", refresh_token, {
            secure: true,
            maxAge: 3600000,
            httpOnly: true,
            sameSite: "none",
          }); //for 1 hour = 3600000 ms//
          response.data = {
            user_exists: response_modal,
            token: token,
            desc: "user is successfully loggedin",
          };
          res.status(200).json(response);
        });
      }
    })
    .catch((e) => console.log(e));
};

exports.registerUser = (req, res, next) => {
  let response = {
    message: "Handling post requests to /resgister",
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
    console.log("registering user...........");

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
        console.log(e);
      });
  }
};

exports.get_fresh_access_token = async (req, res, next) => {
  let response = {
    message: "Handling get requests to /rtoken",
    data: "",
  };
  //check if refresh tocken is sent by browser in cookies, if not the cookie may have expired, so throw 401 and client should logout.
  // to check cookies getting received, use curl: curl http://127.0.0.1:4000/hackers/rtoken --cookie "refresh-token=test"

  refresh_token_from_client = req.cookies["refresh_token"];

  try {
    if (refresh_token_from_client == null) throw "token not found";

    jwt.verify(
      refresh_token_from_client,
      process.env.REFRESH_TOKEN_SECRET,
      (err, token_decoded) => {
        if (err) throw err;

        authModel
          .get_one_hacker(token_decoded.username)
          .then((user_details) => {
            const freshAccessToken = generateAccessToken(user_details);
            response.data = {
              token: freshAccessToken,
              desc: "a fresh access token is generated",
            };

            res.status(200).json(response);
          });
      }
    );
  } catch (error) {
    const response = {
      message: "Auth failed, refreshToken Expired",
      error: error,
      failureCode: "RefreshTokenExpiredError",
    };
    console.log("refresh token error.....", error);

    return res.status(401).json(response);
  }
};
