const express = require('express');
const bcrypt = require('bcryptjs');//hashing the pasword before storing it to the database
const jwt = require('jsonwebtoken');

const keys = require('../config/key');
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login');
const urls = require('../connections/index')
const Urls = require('../models/urls')

const router = express.Router();

router.post('/register',(req,res) => {

    //form validation
    const { errors,isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    Urls.findOne({email:req.body.email}).then(user => {
        if(user){
            return res.status(400).json({email:'Email already exists'})
        }
        else{
            const newUser = new Urls({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password1
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    const payload = {
                      id:user.id
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
                            user,
                            token:"Bearer "+token
                          })
                        }
                      }
                    )
                  })
                  .catch(err => console.log(err));
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
    urls.collection('urls').findOne({ email }).then(user => {
      if (!user) {
        return res.status(404).json({ email: "Email not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id
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
                user,
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
