const validator = require('validator');
const isEmpty = require('is-empty');
const validUrl = require("valid-url");

module.exports = function validateUrlInput(data){
    let  errors = {}
    data.originalUrl = !isEmpty(data.originalUrl)?data.originalUrl:"";
    if (!validUrl.isUri(data.originalUrl)) {
        errors.url = "Please enter a valid url"
    }
    return {
        errors,
        isValid:isEmpty(errors)
    };
}
