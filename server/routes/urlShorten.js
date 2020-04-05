const express = require('express');
const shortid = require("shortid");

const Url = require('../models/urls')
const User = require('../models/users')
const token = require('../token/token')
const validateUrlInput = require('../validation/url')

const router = express.Router();

router.post("/item", token.auth_user, async (req, res) => {
    const { errors,isValid } = validateUrlInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    const originalUrl = req.body.originalUrl
    const userUrls = await User.findOne({
        _id: req.decoded.id
    },{"urls":1,"_id":0})

    Url.find({
        '_id': {$in: userUrls.urls}
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
                    newUrl,
                    shortUrl: newUrl.shortUrl
                })
            }).catch(err => {
                return res.status(404).json(err)
            })
        })
    })
})

router.get('/items', token.auth_user, async(req, res) => {
    console.log(req)
    const userUrls = await User.findOne({
        _id: req.decoded.id
    },{"urls":1,"_id":0})
    Url.find({
        '_id': {$in: userUrls.urls}
    },{"_id":0,"urlCode":0,"__v":0}).then(urls => {
        return res.json({
            success:true,
            urls
        })
    }).catch(err => {
        return res.json(err)
    })
})


router.get('/:code', async(req, res) => {
    const urlCode = req.params.code;
    Url.findOneAndUpdate({
        urlCode
    },{
        $inc:{noOfClicks:1}
    }).then(url => {
        return res.redirect(url.originalUrl)
    }).catch(err => {
        return res.json("Url not found")
    })
})

module.exports = router
