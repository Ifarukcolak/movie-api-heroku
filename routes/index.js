const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

//models
const User = require('../models/User');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

//add new user
router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const user = new User({
      username: username,
      password: hashedPassword
    });

    user.save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  });

});

//authenticate
router.post('/authenticate', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, data) => {
    if (err)
      throw err;
    if (!data) {
      res.json({
        status: false,
        message: "User not found"
      })
    }
    else {
      bcrypt.compare(password, data.password).then((result) => {
        if (!result) {
          res.json({
            status: false,
            message: "Password is wrong"
          })
        }else{

          const payload={
            username
          };

          const token=jwt.sign(payload,req.app.get('api_secret_key'),{
            expiresIn:720 //12 saat
          });

          res.json({
            status:true,
            token:token
          })
        }

      })
    }
  });

});

module.exports = router;
