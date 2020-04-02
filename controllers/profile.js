
const Profile = require("../models/profile");

var vCardsJS = require('vcards-js');

exports.getProfile =(req,res,next) => {
    userId= req.params.id;
    Profile.findById(userId)
    .then(profile => {
        res.status(200).json({
            profileData:profile
        })
    })
    .catch(error=> {
        console.log(err);
    })
    
}

exports.updateProfile =(req,res,next) => {
    userId= req.userId;
    firstName=req.body.firstName;
    lastName=req.body.lastName;
    companyName=req.body.companyName;
    jobTitle=req.body.jobTitle;
    mobileNumber=req.body.mobileNumber;
    homeNumber=req.body.homeNumber;
    email=req.body.email;
    workEmail=req.body.workEmail;
    twitter=req.body.twitter;
    linkedin=req.body.linkedin;
    facebook=req.body.facebook;
    snapchat=req.body.snapchat;
    youtube=req.body.youtube;
    whatsapp=req.body.whatsapp;
    viber=req.body.viber;
    address=req.body.address;
    birthday=req.body.birthday;

  

    Profile.findById(userId)
        .then(profile => {
            profile.profileData.firstName=firstName;
            profile.profileData.lastName=lastName;
            profile.profileData.companyName=companyName;
            profile.profileData.jobTitle=jobTitle;

            profile.profileData.contactInfo.mobilePhone=mobileNumber;
            profile.profileData.contactInfo.homePhone=homeNumber;
            profile.profileData.contactInfo.email=email;
            profile.profileData.contactInfo.workEmail=workEmail;

            profile.profileData.socialNetwork.twitter=twitter;
            profile.profileData.socialNetwork.linkedIn=linkedin;
            profile.profileData.socialNetwork.facebook=facebook;
            profile.profileData.socialNetwork.youtube=youtube;
            profile.profileData.socialNetwork.snapchat=snapchat;

            profile.profileData.directMessage.whatsapp=whatsapp;
            profile.profileData.directMessage.viber=viber;

            profile.profileData.personalInfo.address=address;
            profile.profileData.personalInfo.birthday=birthday;

            return profile.save();

        })
        .then(result=>{
            
            res.status(200).json({
                message: 'Profile updated successfully!',
            });
        })
        .catch(err =>{

        })
}

exports.checkEmail =(req,res,next) => {
    const _email=req.query.email;
    console.log( _email);
    Profile.findOne({email:_email}).then(result =>{
        console.log(result);
        if(!result){
            res.status(200).json({
                message: 'Profile does not exist!',
            });
        }
        else{
            res.status(400).json({
                message: 'Profile does not exist!',
            });
        }
    }).catch(error=>{
        console.log(error);
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
    res.set('Content-Type', 'text/vcard; name="enesser.vcf"');
    res.set('Content-Disposition', 'inline; filename="enesser.vcf"');
    res.send(vCard.getFormattedString());
}
exports.findById =(req,res,next) => {
    const id = req.params.id;
    Profile.findById(id).then(result=>{
        if(result !== null){
            res.status(200).json({
                message: 'Profile found successfully!',
                data: result
            });
        }
        else{
            res.status(400).json({
                message: 'Profile not found',
            });
        }
    
       
    }).catch(err=>{
        
    });
}

