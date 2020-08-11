const crypto = require("crypto");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fs = require("fs");

//Gmail verification
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//models
const Profile = require("../models/profile");
const Credential = require("../models/credentials");

//Utils
const ProfileFieldConvertor = require("../utils/ProfileFieldConvertor/ProfileFieldCOnvertor");

exports.fillData = (req, res, next) => {
  id = req.body.id;
  var showData = {
    firstName: true,
    lastName: true,
    companyName: true,
    jobTitle: true,
    gender: true,
    mobilePhone: true,
    homePhone: true,
    email: true,
    workEmail: true,
    twitter: true,
    linkedIn: true,
    facebook: true,
    snapchat: true,
    youtube: true,
    instagram: true,
    whatsapp: true,
    viber: true,
    adress: true,
    birthday: true,
  };
  mobileNumber = ProfileFieldConvertor.mobileNumberConvertor(
    req.body.mobileNumber,
    "+381"
  );
  homeNumber = ProfileFieldConvertor.homeNumberConvertor(
    req.body.homeNumber,
    "+381"
  );
  email = req.body.email;
  workEmail = req.body.workEmail;

  twitter = req.body.twitter;
  twitterUrl = ProfileFieldConvertor.twitterConvertor(req.body.twitter);
  snapchat = req.body.snapchat;
  snapchatUrl = ProfileFieldConvertor.snapchatConvertor(req.body.snapchat);
  instagram = req.body.instagram;
  instagramUrl = ProfileFieldConvertor.instagramConvertor(req.body.instagram);
  linkedin = req.body.linkedin;
  facebook = req.body.facebook;
  youtube = req.body.youtube;

  whatsapp = ProfileFieldConvertor.mobileNumberConvertor(
    req.body.whatsapp,
    "+381"
  );
  viber = ProfileFieldConvertor.mobileNumberConvertor(req.body.viber, "+381");
  address = req.body.address;
  birthday = req.body.birthday;

  if (req.body.firstName == "") {
    showData.firstName = false;
  }
  if (req.body.lastName == "") {
    showData.lastName = false;
  }
  if (req.body.companyName == "") {
    showData.companyName = false;
  }
  if (req.body.jobTitle == "") {
    showData.jobTitle = false;
  }
  if (req.body.mobileNumber == "") {
    mobileNumber = "";
    showData.mobilePhone = false;
  }
  if (req.body.homeNumber == "") {
    homeNumber = "";
    showData.homePhone = false;
  }
  if (req.body.email == "") {
    showData.email = false;
  }
  if (req.body.workEmail == "") {
    showData.workEmail = false;
  }
  if (req.body.twitter == "") {
    twitterUrl = "";
    showData.twitter = false;
  }
  if (req.body.snapchat == "") {
    snapchatUrl = "";
    showData.snapchat = false;
  }
  if (req.body.instagram == "") {
    instagramUrl = "";
    showData.instagram = false;
  }
  if (req.body.facebook == "") {
    showData.facebook = false;
  }
  if (req.body.linkedIn == "") {
    showData.linkedIn = false;
  }
  if (req.body.youtube == "") {
    showData.youtube = false;
  }
  if (req.body.whatsapp == "") {
    showData.whatsapp = false;
  }
  if (req.body.viber == "") {
    showData.viber = false;
  }
  if (req.body.address == "") {
    showData.address = false;
  }
  if (req.body.birthday == "") {
    showData.birthday = false;
  }

  Profile.findById(id)
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this id could not be found!");
        error.statusCode = 401;
        throw error;
      }
      user.profileData.contactInfo.mobilePhone = mobileNumber;
      user.profileData.contactInfo.homePhone = homeNumber;
      user.profileData.contactInfo.email = email;
      user.profileData.contactInfo.workEmail = workEmail;

      user.profileData.socialNetwork.twitter = [twitter, twitterUrl];
      user.profileData.socialNetwork.linkedIn = ["Pogledaj profil", linkedin];
      user.profileData.socialNetwork.facebook = ["Pogledaj profil", facebook];
      user.profileData.socialNetwork.youtube = ["Pogledaj profil", youtube];
      user.profileData.socialNetwork.snapchat = [snapchat, snapchatUrl];
      user.profileData.socialNetwork.instagram = [instagram, instagramUrl];

      user.profileData.directMessage.whatsapp = whatsapp;
      user.profileData.directMessage.viber = viber;

      user.profileData.personalInfo.adress = address;
      user.profileData.personalInfo.birthday = birthday;

      user.showData = showData;

      return user.save();
    })
    .then((profileData) => {
      res.status(200).json({
        msg: "Field Added success",
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.validateProfile = async (req, res, next) => {
  console.log("Pocetak");
  const token = req.params.token;

  try {
    const user = await Profile.findOne({
      validationToken: token,
    });
    const token2 = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "!secrethashtagfortokenvalidationsss!!##432",
      { expiresIn: "1h" }
    );
    if (user.validation === true) {
      return res.status(200).json({
        token: token2,
        userId: user._id,
        verified: true,
      });
    }
    if (user.validationTokenExpiration > Date.now()) {
    
      user.validation = true;
      const saveUser = await user.save();

      return res.status(200).json({
        token: token2,
        userId: user._id,
      });
    } else {
 
      const userDeleted = await Profile.findOneAndDelete({
        validationToken: token,
      });
      return res.status(401).json({
        msg: "User deleted",
      });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  Profile.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found!");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password is incorect!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id,
        },
        "!secrethashtagfortokenvalidationsss!!##432",
        { expiresIn: "1h" }
      );
      const imageUrl = loadedUser.imageUrl;

      fs.readFile(imageUrl, (err, data) => {
        if (err) throw err;

        let buff = new Buffer(data);
        let base64data = buff.toString("base64");
        base64data = "data:image/png;base64," + base64data;
        res.status(200).json({
          user: loadedUser,
          token: token,
          userId: loadedUser._id,
          profileImage: base64data,
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signup = async (req, res, next) => {
  try {
    const findCredential = await Credential.findOne({ _id: "credentials" });
    const oauth2Client = new OAuth2(
      findCredential.ClientID, // ClientID
      findCredential.ClientSecret, // Client Secret
      findCredential.RedirectURL // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: findCredential.refresh_token,
    });
    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: findCredential.userGmail,
        clientId: findCredential.ClientID,
        clientSecret: findCredential.ClientSecret,
        refreshToken: findCredential.refresh_token,
        accessToken: accessToken,
      },
    });
    const error = validationResult(req);
    console.log(error);
    if (!error.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = error.array();
      throw error;
    }
    const id = req.body.id;
    const email = req.body.email;
    const firstName = ProfileFieldConvertor.UpperFirstLetterConvertor(
      req.body.firstName
    );
    const lastName = ProfileFieldConvertor.UpperFirstLetterConvertor(
      req.body.lastName
    );
    const password = req.body.password;
    const companyName = req.body.companyName.toUpperCase();
    const jobTitle = req.body.jobTitle.toUpperCase();
    const gender = req.body.gender;

    var urlImage;
    if (gender === "male") {
      urlImage = "./public/profile-images/avatarMan.jpg";
    } else {
      urlImage = "./public/profile-images/avatarGirl.jpg";
    }
    const hashedPw = await bcrypt.hash(password, 12);
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        const error = new Error("System failed");
        error.statusCode = 422;
        error.data = error.array();
        throw error;
      }
      const token = buffer.toString("hex");
      var profile = new Profile({
        _id: id,
        email: email,
        password: hashedPw,
        imageUrl: urlImage,
        validation: true,
        validationToken: token,
        validationTokenExpiration: Date.now() + 3600000,
        profileData: {
          firstName: firstName,
          lastName: lastName,
          companyName: companyName,
          jobTitle: jobTitle,
          gender: gender,
        },
      });
      /*
      const mailOptions = {
        from: "opacicaleksa4@gmail.com",
        to: email,
        subject: "Email confirm",
        generateTextFromHTML: true,
        html: `
          <p> Click on link to confirm email! <p>
          <p> CLick this <a href="http://localhost:3000/auth/${token}> </a>
      `,
      };
      smtpTransport.sendMail(mailOptions, (error, response) => {
        if (!error) {
          console.log(response);
        } else {
          const error = new Error("System failed");
          error.statusCode = 422;
          error.data = error.array();
          throw error;
        }
        smtpTransport.close();
      });
      */
      const savedProfile = await profile.save();
      res.status(200).json({
        msg: "Succesfull",
        token: token,
        id: id,
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
