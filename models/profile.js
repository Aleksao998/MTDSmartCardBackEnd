const mongoose = require("mongoose");
const Shema = mongoose.Schema;


const profileShema = new Shema({
    _id:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
      },
    password: {
        type: String,
        required: true
    },
    profileData:{
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        companyName:{
            type: String,
        },
        jobTitle:{
            type: String,
        },
        contactInfo:{
            mobilePhone:{
                type: Number,
            },
            homePhone:{
                type: Number,
            },
            email:{
                type: String,
            },
            workEmail:{
                type: String,
            }
        },
        socialNetwork:{
            twitter:{
                type: String,
            },
            linkedIn:{
                type: String,
            },
            facebook:{
                type: String,
            },
            snapchat:{
                type: String,
            },
            youtube:{
                type: String,
            }
        },
        directMessage:{
            whatsapp:{
                type: Number,
            },
            viber:{
                type: Number,
            },
        },
        personalInfo:{
            adress:{
                type: String,
            },
            birthday:{
                type: Date,
            },
        }
    }
}, 
{timestamps:true}
)


module.exports= mongoose.model("Profile", profileShema)