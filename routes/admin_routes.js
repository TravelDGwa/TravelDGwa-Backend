const express  = require('express');
const User = require('../models/user_model')
const passport = require('passport')
const router = express.Router()
const rentcarpartner = require('../models/rentcar_partner_model')
const rentcarcarinfo = require('../models/rentcar_carinfo_model')
const airporttransferpartner = require('../models/airport_transfer_partner_model')

router.post('/signin',(req,res,next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) return res.status(401).json(err)
        if (user) {
            // const token = user.generateJwt();
            return res.status(200).json({
                // "token": token
            });
        } else {
            console.log('user not found or wrong password')
            return res.status(401).json(info);
        }
    })(req, res, next)
})

router.get('/getuser',(req,res) => {
    User.find({role:'user'},(err,foundUser) => {
        if(err){
            console.log(err)
        } else{
            return res.json(foundUser);
        }
    })
})

router.get('/getuser/:id',(req,res) => {
    User.findById(req.params.id,(err,foundUser) => {
        if(err){
            console.log(err)
        } else{
            return res.json(foundUser);
        }
    })
})

router.delete('/deleteuser/:id',(req,res) => {
    User.findByIdAndDelete(req.params.id,(err,deleted) => {
        if(err){
            console.log(err);
        } else {
            res.status(200).json()
        }
    })
})

router.post('/promote/:id',(req,res) => {
    User.findByIdAndUpdate(req.params.id,{$set:{role:'admin'}},(err,foundUser) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundUser);
        }
    })
})

router.get('/getrentcarpartner',(req,res) => {
    rentcarpartner.find({partner:true}).populate('usernameID').exec((err,foundPartner) => {
        if(err){
            console.log(err)
        } else{
            return res.json(foundPartner);
        }
    })
})

router.get('/getrentcarpartner/:id',(req,res) => {
    rentcarcarinfo.find({PartnerID:req.params.id}).populate('PartnerID').exec((err,foundPartner) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundPartner)
        }
    })
})

router.delete('/deleterentcarpartner/:id',(req,res) => {
    rentcarcarinfo.findOneAndDelete({PartnerID:req.params.id},(err,deleted) => {
        if(err){
            console.log(err)
        } else {
            rentcarpartner.findByIdAndDelete(req.params.id , (err,infodeleted) => {
                if(err){
                    console.log(err)
                } else {
                    return res.status(200).json()
                }
            })
        }
    })
})

router.get('/getshuttlepartner',(req,res) => {
    airporttransferpartner.find({partner:true}).populate('usernameID').exec((err,foundPartner) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundPartner)
        }
    })
})

router.get('/getshuttlepartner/:id',(req,res) => {
    airporttransferpartner.findById(req.params.id).populate('usernameID').exec((err,foundPartner) => {
        if(err){
            console.log(err)
        } else{
            return res.json(foundPartner);
        }
    })
})

router.delete('/deleteshuttlepartner/:id',(req,res) => {
    airporttransferpartner.findByIdAndDelete(req.params.id,(err,deleted) => {
        if(err){
            console.log(err)
        } else {
            console.log(deleted)
            return res.status(200).json()
        }
    })
})

// router.get('/getactivitypartner',(req,res) => {
    
// })


router.get('/getrentcarregister',(req,res) => {
    rentcarpartner.find({partner:false}).populate('usernameID').exec((err,foundRegister) => {
        if(err){
            console.log(err)
        } else{
            return res.json(foundRegister);
        }
    })
})

router.put('/rentcarregister/approve/:id',(req,res) => {
    rentcarpartner.findByIdAndUpdate(req.params.id,{$set:{partner:true}},(err,approved) => {
        if(err){
            console.log(err)
        } else {
            return res.status(200).json()
        }
    })
})

router.delete('/rentcarregister/reject/:id',(req,res) => {
    rentcarcarinfo.findOneAndDelete({PartnerID:req.params.id},(err,deleted) => {
        if(err){
            console.log(err)
        } else {
            rentcarpartner.findByIdAndDelete(req.params.id , (err,infodeleted) => {
                if(err){
                    console.log(err)
                } else {
                    return res.status(200).json()
                }
            })
        }
    })
})

router.get('/getshuttleregister',(req,res) => {
    airporttransferpartner.find({partner:false}).populate('usernameID').exec((err,foundRegister) => {
        if(err){
            console.log(err)
        } else{
            return res.json(foundRegister);
        }
    })
})

router.put('/shuttleregister/approve/:id',(req,res) => {
    airporttransferpartner.findByIdAndUpdate(req.params.id,{$set:{partner:true}},(err,approved) => {
        if(err){
            console.log(err)
        } else {
            return res.status(200).json()
        }
    })
})

router.delete('/shuttleregister/reject/:id',(req,res) => {
    airporttransferpartner.findByIdAndDelete(req.params.id,(err,deleted) => {
        if(err){
            console.log(err)
        } else {
            return res.status(200).json()
        }
    })
})


module.exports = router