const express  = require('express');
const User = require('../models/user_model')
const passport = require('passport')
const router = express.Router()
const rentcarpartner = require('../models/rentcar_partner_model')
const rentcarcarinfo = require('../models/rentcar_carinfo_model')
const airporttransferpartner = require('../models/airport_transfer_partner_model')

const rentcarreceipt = require('../models/rentcar_transaction_model')

router.get('/rentcar',(req,res) => {
    rentcarreceipt.find().populate('usernameID').exec((err,foundRentcarTransaction) => {
        if(err){
            console.log(err)
        } else {
            return res.json(foundRentcarTransaction)
        }
    })
})



module.exports = router