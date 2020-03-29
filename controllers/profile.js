
const Profile = require("../models/profile");
var vCardsJS = require('vcards-js');

exports.getProfile =(req,res,next) => {
    res.status(200).json({
        profile:[{firstName:"Aleksa", lastName:"Opacic"}]
    })
}
exports.createVCF=(req,res,next) => {
    var vCard = vCardsJS();
    vCard.firstName = req.query.firstName;
    vCard.lastName = req.query.lastName;
    vCard.organization = req.query.organization;
    vCard.role = req.query.jobTitle;
    //Contact info
    vCard.homePhone = req.query.homePhone;
    vCard.cellPhone = req.query.mobileNumber;
    vCard.email =req.query.email;
    vCard.workEmail =req.query.workEmail;

    //Social network
    vCard.socialUrls['facebook'] = req.query.facebook;
    vCard.socialUrls['linkedIn'] = req.query.linkedIn;
    vCard.socialUrls['twitter'] =  req.query.twitter;
    vCard.socialUrls['snapchat'] = req.query.snapchat;
    vCard.socialUrls['youtube'] =  req.query.youtube;

    //Direct messages

    //Personal info
 
    vCard.homeAddress.street=req.query.address;
    console.log(vCard.getFormattedString());
    
    res.set('Content-Type', 'text/vcard; name="enesser.vcf"');
    res.set('Content-Disposition', 'inline; filename="enesser.vcf"');
    res.send(vCard.getFormattedString());
}
exports.findById =(req,res,next) => {
    const id = req.params.id;
    console.log(id);
    Profile.findById(id).then(result=>{
        res.status(200).json({
            message: 'Profile found successfully!',
            data: result
        });
    }).catch(err=>{
        console.log(err);
    });
}
exports.createProfile = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const profile= new Profile({
        email:email,
        password:password,
        verified:false,
        profileData:{
            firstName:"Aleksa",
            lastName:"Opacic"
        }
    });

    profile.save()
    .then(result => {
      res.status(201).json({
        message: 'Profile created successfully!',
        post: result
      });
    })
    .catch(err => {
      console.log(err);
    });
    
    
}