const express = require("express");
const profileController = require("../controllers/profile");
const router = express.Router();

const isAuth = require("../middleware/is-auth");

//GET /profile/profileData
router.get("/profileData/:id", profileController.getProfile);

//GET /profile/findProfileById
router.get("/findProfileById/:id", profileController.findById);

//GET /profile/createVCF
router.get("/createVCF", profileController.createVCF);

//GET /profile/checkEmail
router.get("/checkEmail", profileController.checkEmail);

//UPDATE /profile/updateProfile
router.post("/updateProfile", isAuth, profileController.updateProfile);

//GET /profile/checkEmail
router.post("/uploadImage", profileController.uploadImage);

module.exports = router;
