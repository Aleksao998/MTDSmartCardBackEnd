
const Profile = require("../models/profile");
const arrayWrap = require("arraywrap");

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
        console.log(error);
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
    const email=arrayWrap(req.query.email || '');
    console.log("Email : "+email[0]);
    const _email=email[0];
    Profile.findOne({email:_email}).then(result =>{
        if(!result){
            res.status(200).json({
                message: 'Profile does not exist!',
            });
            return;
        }
        else{
            res.status(400).json({
                message: 'Profile does not exist!',
            });
            return;
        }
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.createVCF=(req,res,next) => {
    var vCard = vCardsJS();
    
    const firstName=arrayWrap(req.query.firstName || '');
    
    vCard.firstName = firstName[0];

   
    const lastName=arrayWrap(req.query.lastName || '');
    vCard.lastName = lastName[0];

    const organization= arrayWrap(req.query.organization || '');
    vCard.organization = organization[0];

    const role=arrayWrap(req.query.jobTitle || '');
    vCard.role = role[0];

    //Contact info
    const homePhone=arrayWrap(req.query.homePhone || '');
    vCard.homePhone = homePhone[0];

    const cellPhone= arrayWrap(req.query.mobileNumber || '');
    vCard.cellPhone = cellPhone[0];

    const email= arrayWrap(req.query.email || '');
    vCard.email =email[0];

    const workEmail= arrayWrap(req.query.workEmail || '');
    vCard.workEmail =workEmail[0];

    //Social network
    const facebook= arrayWrap(req.query.facebook || '');
    vCard.socialUrls['facebook'] = facebook[0];

    const linkedIn=arrayWrap(req.query.linkedIn || '');
    vCard.socialUrls['linkedIn'] = linkedIn[0];

    const twitter=arrayWrap(req.query.twitter || '');
    vCard.socialUrls['twitter'] =  twitter[0];

    const snapchat= arrayWrap(req.query.snapchat || '');
    vCard.socialUrls['snapchat'] = snapchat[0];

    const youtube= arrayWrap(req.query.youtube || '');
    vCard.socialUrls['youtube'] =  youtube[0];

    //Direct messages

    //Personal info
    const homeAddress= arrayWrap(req.query.address || '');
    vCard.homeAddress.street=homeAddress[0];

    res.set('Content-Type', 'text/vcard; name="enesser.vcf"');
    res.set('Content-Disposition', 'inline; filename="enesser.vcf"');
    res.send(vCard.getFormattedString());
}
exports.findById =(req,res,next) => {
    console.log("findById");
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
        console.log(err);
    });
}

