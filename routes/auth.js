const express = require("express");
const {body}= require("express-validator/check");
//Models
const Profile = require("../models/profile");
//Controllers
const authController = require("../controllers/auth");

const router = express.Router();


//GET /auth/signup
router.put("/signup",[
    body('id')
    .trim()
    .isLength({min: 8, max:8})
    .withMessage("Error with id"),

   body('email')
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

   body('password')
    .trim()
    .isLength({min: 5}),
   
   body('firstName')
    .trim()
    .not()
    .isEmpty(),

   body('lastName')
    .trim()
    .not()
    .isEmpty(), 
],authController.signup);

//POST /auth/login
router.post("/login",authController.login)

module.exports= router;