const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const jwtSecret = "MyNameIsRohitRoyAndIAmAtB.Tech4thYear"

router.post(
  '/createuser',
  [
    body('email').isEmail(), // data validator is used to check wheather the given data is valid or not
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    // This validation is used to valid data on the basis of above params
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Using bcrypt library to store password in hashed form
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password,salt);

    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      })
      res.json({ success: true})
    } catch (error) {
      console.log(error)
      res.json({ success: false })
    }
  },
)

router.post(
  '/loginuser',
  [
    body('email').isEmail(), // data validator is used to check wheather the given data is valid or not
    body('password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    // This validation is used to valid data on the basis of above params
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    let email = req.body.email
    try {
      let userData = await User.findOne({ email })
      if (!userData) {
        return res
          .status(400)
          .json({ errors: 'Try logging with correct credentials' })
      }

      const pwdCompare = await bcrypt.compare(req.body.password,userData.password)

      if (!pwdCompare) {
        return res
          .status(400)
          .json({ errors: 'Try logging with correct credentials' })
      }

      const data = {
        user:{
          id: userData.id
        }
      }

      const authToken = jwt.sign(data,jwtSecret)

      return res.json({ success: true,authToken:authToken})
    } catch (error) {
      console.log(error)
      res.json({ success: false })
    }
  },
)

module.exports = router
