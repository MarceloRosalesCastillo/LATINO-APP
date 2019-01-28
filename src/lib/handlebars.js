const dateFormat = require("dateformat");
const dateFInstant = dateFormat();
const helpers = {};

helpers.dateFormat = (date) => {
    return dateFormat(date, " dd / mm / yyyy ");
}
helpers.dateFormatD = (date) => {
    return dateFormat(date, "dd");
}
helpers.dateFormatM = (date) => {
    return dateFormat(date, "mm");
}
helpers.dateFormatY = (date) => {
    return dateFormat(date, "yyyy");
}


module.exports = helpers;