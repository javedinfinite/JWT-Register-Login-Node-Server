const hackerModel = require("../models/hacker")

exports.get_all_hackers =  (req, res, next) => {

    hackerModel.get_all_hackers().then((data) => {
        const response = {
          message : "Handling get requests to /hackers. All hackers list is provided to you as following",
          users : data
        };
        res.status(200).json(response);

      }).catch(e => console.log(e));
};


exports.get_hacker_details = (req, res, next) => {
 
    hackerModel.get_hacker_details(req.params.id).then((data) => {
        
        const response = {
          message : "Handling get requests to /hackerDetails. Hacker details is provided to you as following",
          users : data
        };
        res.status(200).json(response);
  
      }).catch(e => console.log(e));
  
  };

  exports.get_top_n_details = (req, res, next) => {
 
      hackerModel.get_top_n_details(req.params.number).then((data) => {
        
        const response = {
          message : "Handling get requests to /topHackers. Top hacker details is provided to you as following",
          users : data
        };
        res.status(200).json(response);
  
      }).catch(e => console.log(e));
  
  };