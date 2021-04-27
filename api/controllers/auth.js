var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const authModel = require('../models/auth')
require("dotenv").config();

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: 60 });
  }

exports.registerUser = (req, res, next) => {

      data = {
        'name': req.body.name,
        'user_name' : req.body.user_name,
        'password' : bcrypt.hashSync(req.body.password, 8),
        'user_type' : req.body.user_type
    }

    authModel.register_hacker(data).then((response_modal) => {

    let response = {
        message : "Handling get requests to /resgister",
        data :  ""
    };

    if(response_modal==false){

        response.data =  {user_exists: response_modal, reason:"Username is taken, please try other unique_name"} 
        res.status(200).json(response);

    }

    const token = generateAccessToken({ username: req.body.user_name });
    response.data =  {user_exists: response_modal, token:token}
    res.status(200).json(response);

    }).catch(e => console.log(e));
}
