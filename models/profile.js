const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const profileShema = new Shema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    validation: Boolean,
    validationToken: String,
    validationTokenExpiration: Date,
    profileData: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      companyName: {
        type: String,
      },
      jobTitle: {
        type: String,
      },
      gender: {
        type: String,
      },
      contactInfo: {
        mobilePhone: {
          type: Number,
        },
        homePhone: {
          type: Number,
        },
        email: {
          type: String,
        },
        workEmail: {
          type: String,
        },
      },
      socialNetwork: {
        twitter: [
          {
            type: String,
          },
        ],
        linkedIn: [
          {
            type: String,
          },
        ],
        facebook: [
          {
            type: String,
          },
        ],
        snapchat: [
          {
            type: String,
          },
        ],
        youtube: [
          {
            type: String,
          },
        ],
        instagram: [
          {
            type: String,
          },
        ],
      },
      directMessage: {
        whatsapp: {
          type: Number,
        },
        viber: {
          type: Number,
        },
      },
      personalInfo: {
        adress: {
          type: String,
        },
        birthday: {
          type: String,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileShema);
