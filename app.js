const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

const hackerRoutes = require("./api/routes/hacker");
 
app.use(morgan("dev")); 

app.use(cookieParser());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3002"); // wildcard (*) not allowed while using withCredentials in request, withCredentials used to include cookie and auth info in request
  res.header("Access-Control-Allow-Credentials", true); // this header with true value required in response while using withCredentials in request so that cookie will not be ingnored in the reponse by browser
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") { // Since we are not using any CORS package we are handling option method by ourself.
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/hackers", hackerRoutes);

app.use("/",(req, res, next) => {
  res.status(200).json({"message":"this route is not available"});
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;