const express = require('express');
const shortid = require("shortid");

const Url = require('../models/urls')
const User = require('../models/users')
const token = require('../token/token')
const validateUrlInput = require('../validation/url')

const router = express.Router();

// router.get('/item/:code', token.auth_user, async(req, res) => {
//     const urlCode = req.params.code;
//     const item = await Urls.findOne({
//         _id: req.decoded.id
//     }).select({urls: {$elemMatch: {urlCode}}});
//     if (item) {
//         Urls.updateOne({
//             _id:req.decoded.id,
//             "urls.urlCode": urlCode
//         },{$inc:{"urls.$.noOfClicks": 1}},
//         function(error,success){
//             if(error) return res.json(error)
//             else return res.redirect(item.urls[0].originalUrl)
//         }
//         )
//       }else {
//           return res.json({
//             success: false,
//             message: "Url not found"
//           })
//       }
// })

router.post("/item", token.auth_user, async (req, res) => {
    const { errors,isValid } = validateUrlInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    const originalUrl = req.body.originalUrl
    const userUrls = await User.find({
        _id: req.decoded.id
    },{urls:1})

    Url.find({
        '_id': {$in: userUrls[0].urls}
    },{"_id":0,"originalUrl":1,"shortUrl":1}).then(urls => {
        for( const url of urls){
            if(url.originalUrl===originalUrl){
                return res.json({
                    sucess: true,
                    shortUrl:url.shortUrl
                })
            }
        }
        const urlCode = shortid.generate();
        const shortUrl = process.env.URL + "/" + urlCode;
        const newUrl = new Url({
            originalUrl,
            urlCode,
            shortUrl,
            createdAt: Date.now()
        })
        newUrl.save().then(url => {
            User.findOneAndUpdate({
                _id: req.decoded.id
            },{
                $push: {urls: url}
            },{new: true}).then(user => {
                return res.json({
                    success: true,
                    newUrl
                })
            }).catch(err => {
                return res.status(404).json(err)
            })
        })
    })
})

// router.get('/items', token.auth_user, async(req, res) => {
//     const user = await User.findOne({
//         _id: req.decoded.id
//     })
//     res.status(200).json({
//         success:true,
//         user
//     })
// })

module.exports = router
