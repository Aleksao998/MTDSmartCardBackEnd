const express = require("express");
const profileController = require("../controllers/profile");
const router = express.Router();


//GET /profile/profileData
router.get("/profileData", profileController.getProfile);

//POST /profile/createProfile
router.post("/createProfile", profileController.createProfile);

//GET /profile/findProfileById
router.get("/findProfileById/:id", profileController.findById);


//GET /profile/createVCF
router.get("/createVCF", profileController.createVCF);

module.exports= router;