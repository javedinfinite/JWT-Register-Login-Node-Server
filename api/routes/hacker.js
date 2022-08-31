const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const HackerController = require('../controllers/hacker');
const AuthController = require('../controllers/auth');


router.get("/",(req, res, next) => {
  res.status(200).json({"message":" yup! u got it right..., try /all, /count, /:pageNum with autorization header = bearer token"});
  });

router.get("/rtoken", AuthController.get_refresh_token);

router.get("/all", authenticate, HackerController.get_all_hackers);

router.get("/count",authenticate, HackerController.get_hackers_count);

router.get("/:pageNum",authenticate, HackerController.get_hackers_by_page_num);

router.get("/details/:id", authenticate, HackerController.get_hacker_details);

router.get("/top/:number", authenticate, HackerController.get_top_n_hackers);

router.post("/register", AuthController.registerUser);

router.post("/login", AuthController.loginUser);





module.exports = router;