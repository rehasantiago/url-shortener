const express = require('express');
const mongoose = require("mongoose");
const validUrl = require("valid-url");
const shortid = require("shortid");

const Urls = require('../models/urls')
const token = require('../token/token')

const router = express.Router();

router.get('/api/item/:code', token.auth_user, async(req, res) => {
    const urlCode = req.params.code;
    const item = await Urls.findOne({ urlCode: urlCode });
    if (item) {
        return res.redirect(item.originalUrl);
      }
})

app.post("/api/item", token.auth_user, async (req, res) => {
    const originalUrl = req.body;
    const shortBaseUrl = "http://rehas"
    if (validUrl.isUri(shortBaseUrl)) {
    } else {
      return res
        .status(401)
        .json(
          "Invalid Base Url"
        );
    }
    const urlCode = shortid.generate();
    const updatedAt = new Date();
    if (validUrl.isUri(originalUrl)) {
        try {
            const item = await UrlShorten.findOne({ originalUrl: originalUrl });
            if (item) {
              res.status(200).json(item);
            } else {
              shortUrl = shortBaseUrl + "/" + urlCode;
              //insert url and send it
            }
          } catch (err) {
            res.status(401).json("Invalid User Id");
          }
        } else {
          return res
            .status(401)
            .json(
              "Invalid Original Url"
            );
        }
})
