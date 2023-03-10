require('dotenv').config();
const BCRYPT = require('bcrypt');
const USERMODULE = require('../models/users');
const jwt = require('jsonwebtoken');

/**
 * Create and register new user
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.signup = (req, res) =>{
  BCRYPT.hash(req.body.password, 10)
      .then((hash) => {
        const user = new USERMODULE({
          email: req.body.email,
          password: hash,
        });
        user.save()
            .then(() => res.status(201).json({message: 'User created !'}))
            .catch((error) => res.status(400).json({error}));
      })
      .catch((error) => res.status(500).json({error}));
};

/**
 * Log n existant user 
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.login = (req, res) => {
  USERMODULE.findOne({email: req.body.email})
      .then((user) => {
        if(user === null) {
          res.status(401).json({message:
            'User or password is incorrect !'});
        } else {
          BCRYPT.compare(req.body.password, user.password)
              .then((valid) => {
                if(!valid) {
                  res.status(401).json({message:
                  'User or password is incorrect !'});
                } else {
                  res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                      {userId: user._id},
                      process.env.decodedTokenEnv,
                      {expiresIn: '24h'},
                    ),
                  });
                }
              });
        }
      })
      .catch((error) => res.status(500).json({error}));
};
