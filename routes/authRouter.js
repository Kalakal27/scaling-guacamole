const express = require('express')
const authRouter = express.Router()
const User = require('../models/User.js')
const jwt = require('jsonwebtoken')



authRouter.post("/signup", async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        res.status(403);
        return next(new Error("that username is already in use!"));
      }
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      const token = jwt.sign(savedUser.toObject(), process.env.SECRET);
      return res.status(201).send({ token, user: savedUser.username });
  
    } catch (err) {
      res.status(500);
      return next(err);
    }
  });

  authRouter.post("/login", async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if(user) {
        res.status(403)
        return next(new Error("Username or Password are incorrect"))
      }
      if(req.body.password !== user.password){
        res.status(403)
        return next( new Error("Username or Password are incorrect"))
      }
      const token = jwt.sign(savedUser.toObject(), process.env.SECRET);
      return res.status(201).send({ token, user: savedUser.username });
    } 
    catch (err) {
      res.status(500);
      return next(err);
    }
  });




module.exports = authRouter