var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const authModel = require('../models/auth')

exports.registerUser = (req, res, next) => {

      data = {
        'name': req.body.name,
        'user_name' : req.body.user_name,
        'password' : bcrypt.hashSync(req.body.password, 8),
        'user_type' : req.body.user_type
    }

    authModel.register_hacker(data).then((response_modal) => {
    const response = {
        message : "Handling get requests to /resgister",
        users : response_modal
    };
    res.status(200).json(response);

    }).catch(e => console.log(e));
}