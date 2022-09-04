const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
      
        if (token == null) throw "token not found"
      
        jwt.verify(token, process.env.TOKEN_SECRET, (err, token_decoded) => {
      
          if (err) throw  err
      
          req.user = token_decoded
          next();
        })
    } catch (error) {

        const response = {
            message: "Auth failed, Invalid user..",
            error: error,
            failureCode: "",
          };
        if(error.name==='TokenExpiredError' || error.name==='JsonWebTokenError'){
            response.message = error.message
            response.failureCode = error.name
        }
            
        return res.status(401).json(response);
    }
};