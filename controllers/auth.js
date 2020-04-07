const {validationResult} = require("express-validator");
const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profile");

exports.login = (req,res,next) => {
    const email= req.body.email;
    const password= req.body.password;
    let loadedUser;
    Profile.findOne({email:email})
           .then(user =>{
              if(!user){
               const error = new Error("A user with this email could not be found!");
               error.statusCode=401;
               throw error;
            
              } 
              loadedUser=user;
              return bcrypt.compare(password, user.password);
           })
           .then(isEqual =>{
               if(!isEqual){
                const error = new Error("Password is incorect!");
                error.status=401;
                throw error;
               }
               
               const token= jwt.sign({
                   email:loadedUser.email,
                   userId:loadedUser._id
               },"!secrethashtagfortokenvalidationsss!!##432",{expiresIn: '1h'});
                 res.status(200).json({
                   token:token,
                   userId:loadedUser._id
               })
           })
           .catch(err =>{
            
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
           })
}

exports.signup = (req,res,next) => {
    const error = validationResult(req);
    console.log(error);
    if(!error.isEmpty()){
        const error = new Error("Validation failed.");
        error.statusCode= 422;
        error.data = error.array();
        throw error;
    }
    const id= req.body.id;
    const email= req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password= req.body.password;
    bcrypt.hash(password,12)
        .then(hashedPw => {
            const profile = new Profile({
                _id:id,
                email:email,
                password:hashedPw,
                profileData:{
                    firstName:firstName,
                    lastName:lastName
                }
            });
            return profile.save();
        })
        .then(req => {  
            const token= jwt.sign({
                email:email,
                userId:id
            },"!secrethashtagfortokenvalidationsss!!##432",{expiresIn: '1h'});
           res.status(200).json({
                token:token,
                userId:id
            })
        })
        .catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

}