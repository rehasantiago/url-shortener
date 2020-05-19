const express = require('express');
const bcrypt = require('bcryptjs');//hashing the pasword before storing it to the database
const jwt = require('jsonwebtoken');

const keys = require('../config/key');
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login');
const User = require('../models/users')

const router = express.Router();

router.post('/register',(req,res) => {
    //form validation
    const { errors,isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email:req.body.email}).then(user => {
        if(user){
            return res.status(400).json({email:'Email already exists'})
        }
        else{
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password1
            });
            console.log(newUser);
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    const payload = {
                      id:user._id
                    };
                    jwt.sign(payload,
                      keys.secretOrKey,
                      {
                      expiresIn: 31556926,
                      algorithm:'HS384'
                      },
                      (err,token) => {
                        if(err) return res.json(err);
                        else {
                          res.json({
                            success:true,
                            token:"Bearer "+token
                          })
                        }
                      }
                    )
                  })
                  .catch(err => {return res.json(err)});
              });
            });
        }
    })
})

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(404).json({ email: "Email not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user._id
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926,
              algorithm:'HS384'
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ password: "Password incorrect" });
        }
      });
    });
  });

module.exports = router;
