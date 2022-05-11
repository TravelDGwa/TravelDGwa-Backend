const express  = require('express')
const AccomTransaction = require('../models/accommodation_transaction')
const jwt = require('jwt-simple')
const secret = require('..').SecretText
const Hotel = require('../models/hotel_model')
const router = express.Router()

router.post('/' , (req,res) => {
    console.log(req.body.image)
    var token = req.headers.authorization.split(' ')[1]
    // we need to convert the string to JSON object first.
    var stringToken = JSON.parse(token)['token']
    var user = jwt.decode(stringToken, secret)
    AccomTransaction.create({
    usernameId : user._id,
    acc_name : req.body.acc_name,
    checkIn : req.body.checkIn,
    checkOut : req.body.checkOut,
    room : req.body.room,
    numberOfRoom : req.body.numberOfRoom,
    priceOfRoom : req.body.priceOfRoom,
    payDateTime: new Date().toLocaleString(),
    image: req.body.image,
    totalPrice: req.body.totalPrice} , (err,createdTransaction) => {
        if(err) {
            console.log(err)
            res.json(err)
        } else {
            res.json(createdTransaction)
        }
    })
})

module.exports = router