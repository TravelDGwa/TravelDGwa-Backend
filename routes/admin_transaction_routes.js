const express  = require('express');
const User = require('../models/user_model')
const passport = require('passport')
const router = express.Router()
const rentcarpartner = require('../models/rentcar_partner_model')
const rentcarcarinfo = require('../models/rentcar_carinfo_model')
const airporttransferpartner = require('../models/airport_transfer_partner_model')

const rentcarreceipt = require('../models/rentcar_transaction_model')
const airporttransferreceipt = require('../models/airport_transfer_receipt_model')
const activityreceipt = require('../models/activity_receipt_model')
const accommTransaction = require('../models/accommodation_transaction')

router.get('/rentcar',(req,res) => {
    rentcarreceipt.find().populate('usernameID').exec((err,foundRentcarTransaction) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundRentcarTransaction)
        }
    })
})

router.get('/shuttle',(req,res) => {
    airporttransferreceipt.find().populate('usernameID').exec((err,foundShuttleTransaction) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundShuttleTransaction)
        }
    })
})

router.get('/activity',(req,res) => {
    activityreceipt.find().populate('usernameID').exec((err,foundActivityTransaction) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundActivityTransaction)
        }
    })
})

router.get('/accommodation',(req,res) => {
    accommTransaction.find().populate('usernameId').exec((err,foundAccommodationTransaction) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundAccommodationTransaction)
        }
    })
})





module.exports = router