const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const HackerController = require('../controllers/hacker');


router.get("/",(req, res, next) => {
    res.status(200).json({"message":" hackers root route is not available"});
  });

router.get("/hackers", authenticate, HackerController.get_all_hackers);
router.get("/hackerDetails/:id", authenticate, HackerController.get_hacker_details);
router.get("/topHackers/:number", authenticate, HackerController.get_top_n_details);


module.exports = router;