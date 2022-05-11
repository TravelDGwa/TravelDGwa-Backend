const express  = require('express');
const Hotel = require('../models/hotel_model')
const Room = require('../models/room_model')
const middleware = require('../middleware')
const f = require('../functions')
const User = require('../models/user_model')

const router = express.Router()

// router.post('/search' , (req,res) => {
//     var searchWord = req.body.searchWord;
//     Hotel.find({$or:[{name:{$regex:searchWord,$options:'i'}}
//     ,{location:{$regex:searchWord,$options:'i'}}]} , (err , foundHotel) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundHotel)
//             res.json(foundHotel);
//         }
//     })
// })

// router.get('/search/:word' , (req,res) => {
//     var searchWord = req.params.word;
//     Hotel.find({$or:[{name:{$regex:searchWord,$options:'i'}}
//     ,{location:{$regex:searchWord,$options:'i'}}]} , (err , foundHotel) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundHotel);
//             res.json({hotels:foundHotel});
//         }
//     })
// })

router.post('/hotel',async (req,res) => { 
    var token = req.headers.authorization.split(' ')[1]
    // we need to convert the string to JSON object first.
    var stringToken = JSON.parse(token)['token']
    var decodedtoken = jwt.decode(stringToken, secret)
    console.log('update_activity')  
    // const infouser = await User.findById(req.body.username)
    const activitypartner = await new activity({
        usernameID: mongoose.Types.ObjectId(decodedtoken._id),
        // price_extrapay: ,
        // document_require: ,
        // comment: ,
        name: req.body.name[1],
        location: req.body.name[2] + req.body.name[3] + req.body.name[4] + req.body.name[5] + req.body.name[6],
        price: req.body.name[7],
        star: req.body.name[8],
        detail: req.body.name[9],
        open_day: req.body.name[10] + "-" + req.body.name[11],
        open_time: req.body.name[12] + "-" + req.body.name[13],
        image: req.body.name[14],
    })
    for(i = 1;i<req.body.hilight.length;i++){
        activitypartner.hilight.push(req.body.hilight[i])
    }
    for(i = 1;i<req.body.service.length;i++){
        activitypartner.service.push(req.body.service[i])
    }
    // for(i = 1;i<4;i++){
    //     updatepartner.image.push(req.body.image[i])
    // }
    activitypartner.save()
})

router.get('/:id/room' , (req,res) => {
    var hotelId = req.params.id;
    Hotel.findById(hotelId).populate('room').exec((err,foundRoom) => {
        if(err){
            console.log(err)
        } else {
            res.json({rooms:foundRoom})
            console.log(foundRoom)
        }
    })
})

router.get('/search/:word', middleware.isLoggedIn, (req,res) => {
    // console.log(res.locals.currentUser.email)

    var searchWord = req.params.word
    Hotel.find({$or:[{name:{$regex:searchWord,$options:'i'}}
    ,{location:{$regex:searchWord,$options:'i'}}]}).populate('room')
    .exec((err , foundHotel) => {
        if(err){
            console.log(err)
        } else {
            // get user to find favorite
            var user = middleware.getUser(req)
            User.findById(user._id).exec((err,foundUser) => {
                if (err) return console.log(err);

                var HotelList = []
                foundHotel.forEach(hotel => {
                    hotel['room'].sort(function (a,b) {
                        return a.price - b.price;
                    })
                    hotel['price'] = hotel['room'][0]['price'];

                    // get favorite
                    var foundFav = false
                    foundUser.favorite.some(elem => {
                        if ( elem.id.equals(hotel._id) ) {
                            foundFav = true
                        }
                    })
                    let newData = Object.assign(hotel.toObject(), {userFavourited: foundFav})
                    HotelList.push(newData)
                    // console.log(newData)
                });

                res.status(200).json({hotels:HotelList});
            })
            
        }
    })
})

// only used in favorite page so far
router.get('/getData/:id', middleware.isLoggedIn, (req,res) => {
    Hotel.findById(req.params.id).exec((err,foundHotel) => {
        if(err){
        console.log(err)
    } else {
        var user = middleware.getUser(req)
        User.findById(user._id).exec((err,foundUser) => {
            if (err) return console.log(err);
                // get favorite
                var foundFav = false
                foundUser.favorite.some(favelem => {
                    if ( favelem.id.equals(foundHotel._id) ) {
                        foundFav = true
                    }
                })
                let newData = Object.assign(foundHotel.toObject(), {userFavourited: foundFav})

                res.status(200).json({foundObject: newData, userFavourited: foundFav})
        })
    }}
    )
})

router.post('/:id/favourite' , middleware.isLoggedIn , (req,res) => {

    var user = middleware.getUser(req)

    User.findById(user._id, function(err, foundUser) {
        if (err) return console.log(err)
        if (foundUser) {

            var favRemoved = false
            // remove favourite
            foundUser.favorite.some(elem => {
                if (req.params.id === elem.id.toString()) {
                    favRemoved = true
                    foundUser.favorite.pull(elem)
                    console.log('favourite removed')
                } 
            })

            if (favRemoved == false) {
                var newFav = {
                    id : req.params.id,
                    favModel : 'Hotel'
                }
                foundUser.favorite.push(newFav)
            }
            foundUser.save()
        
            return res.status(200).json()
            
        } else {
            return res.status(404).json()
        }
    });
})
module.exports = router