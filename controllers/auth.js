const crypto = require("crypto");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Gmail verification
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//models
const Profile = require("../models/profile");
const Credential = require("../models/credentials");

exports.fillData = (req, res, next) => {
  id = req.body.id;

  mobileNumber = req.body.mobileNumber;
  homeNumber = req.body.homeNumber;
  email = req.body.email;
  workEmail = req.body.workEmail;

  twitter = req.body.twitter;
  linkedin = req.body.linkedin;
  facebook = req.body.facebook;
  snapchat = req.body.snapchat;
  youtube = req.body.youtube;
  instagram = req.body.instagram;

  whatsapp = req.body.whatsapp;
  viber = req.body.viber;
  address = req.body.address;
  birthday = req.body.birthday;

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

      user.profileData.socialNetwork.twitter = twitter;
      user.profileData.socialNetwork.linkedIn = linkedin;
      user.profileData.socialNetwork.facebook = facebook;
      user.profileData.socialNetwork.youtube = youtube;
      user.profileData.socialNetwork.snapchat = snapchat;
      user.profileData.socialNetwork.instagram = instagram;

      user.profileData.directMessage.whatsapp = whatsapp;
      user.profileData.directMessage.viber = viber;

      user.profileData.personalInfo.adress = address;
      user.profileData.personalInfo.birthday = birthday;

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

exports.validateProfile = (req, res, next) => {
  const token = req.params.token;
  Profile.findOne({
    validationToken: token,
    validationTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      user.validation = true;
      user.save();
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        "!secrethashtagfortokenvalidationsss!!##432",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: user._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.validateProfile = (req, res, next) => {
  const token = req.params.token;
  Profile.findOne({
    validationToken: token,
    validationTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      user.validation = true;
      user.save();
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        "!secrethashtagfortokenvalidationsss!!##432",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: user._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
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

      res.status(200).json({
        token: token,
        userId: loadedUser._id,
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
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
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
        validation: false,
        validationToken: token,
        validationTokenExpiration: Date.now() + 3600000,
        profileData: {
          firstName: firstName,
          lastName: lastName,
        },
      });
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
      const savedProfile = await profile.save();
      res.status(200).json({
        msg: "Succesfull",
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
