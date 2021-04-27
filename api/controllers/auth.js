var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const authModel = require('../models/auth')
require("dotenv").config();

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: 60 });
  }



exports.loginUser = (req, res, next) => {

    const user_name = req.body.user_name
    const password =  req.body.password

   
    authModel.validate_user(user_name, password).then((response_modal)=>{

        let response = {
            message : "Handling get requests to /login",
            data :  ""
        };
        if(response_modal==false){

            response.data =  {user_exists: response_modal, reason:"Invalid User"} 
            res.status(200).json(response);

        }
        else{
            const token = generateAccessToken({ username: req.body.user_name });
            response.data =  {user_exists: response_modal, token:token}
            res.status(200).json(response);
        }
    }).catch(e => console.log(e));
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

            response.data =  {duplicate: true, desc:"Username is taken, please try other unique_name"} 
            res.status(409).json(response);
        }
        else{
            response.data =   {duplicate: false, desc:'user registered successfully'}
            res.status(200).json(response);
        }
    }).catch(e => console.log(e));
}
