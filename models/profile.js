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
      },
      lastName: {
        type: String,
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
          type: String,
        },
        homePhone: {
          type: String,
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
          type: String,
        },
        viber: {
          type: String,
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
    showData: {
      firstName: {
        type: Boolean,
        required: true,
      },
      lastName: {
        type: Boolean,
        required: true,
      },
      companyName: {
        type: Boolean,
        required: true,
      },
      jobTitle: {
        type: Boolean,
        required: true,
      },
      gender: {
        type: Boolean,
        required: true,
      },
      mobilePhone: {
        type: Boolean,
        required: true,
      },
      homePhone: {
        type: Boolean,
        required: true,
      },
      email: {
        type: Boolean,
        required: true,
      },
      workEmail: {
        type: Boolean,
        required: true,
      },
      twitter: {
        type: Boolean,
        required: true,
      },
      linkedIn: {
        type: Boolean,
        required: true,
      },
      facebook: {
        type: Boolean,
        required: true,
      },
      snapchat: {
        type: Boolean,
        required: true,
      },
      youtube: {
        type: Boolean,
        required: true,
      },
      instagram: {
        type: Boolean,
        required: true,
      },
      whatsapp: {
        type: Boolean,
        required: true,
      },
      viber: {
        type: Boolean,
        required: true,
      },
      adress: {
        type: Boolean,
        required: true,
      },
      birthday: {
        type: Boolean,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileShema);
