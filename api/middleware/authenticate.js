const jwt = require('jsonwebtoken');
const validate_user = require('../models/auth')


module.exports = (req, res, next) => {
    try {

        //if user is loggong in and request is not with token then 
        //Here need to implement the DB authentication of the user when user don't send token but credential to login.
        //If the user is valid then here writea function to generate JWT token and respond back with token to be used for next requests.
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
      
        // if (token == null) return res.sendStatus(401)
        if (token == null) throw "token not found"
      
        jwt.verify(token, process.env.TOKEN_SECRET, (err, token_decoded) => {
      
          if (err) throw  err
          console.log(token_decoded)
      
          req.user = token_decoded
          next();
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed, Invalid user..',
            error: error
        });
    }
};