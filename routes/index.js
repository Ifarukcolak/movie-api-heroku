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

/**
* @swagger
* /register:
*   post:
*     tags:
*       - index
*     name: Register
*     summary: register with username and password 
*     consumes:
*       - application/json
*     parameters:
*       - name: User
*         in: body
*         schema:     
*           type: object
*           properties:
*             username:
*               type: string
*             password:
*               type: string
*               format : password
*         required:
*           - username
*           - password
*     responses:
*       200:
*         description: registering new user is successfull
*       400:
*         description: bad request
*       
*/
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


/**
* @swagger
* /authenticate:
*   post:
*     tags:
*       - index
*     name: authenticate
*     summary: get access token 
*     consumes:
*       - application/json
*     parameters:
*       - name: User
*         in: body
*         schema:     
*           type: object
*           properties:
*             username:
*               type: string
*             password:
*               type: string
*               format : password
*         required:
*           - username
*           - password
*     responses:
*       200:
*         description: returns access token
*       400:
*         description: bad request
*       
*/
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
