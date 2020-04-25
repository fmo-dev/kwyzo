
// db.js
const config = require('./config'); // Appel du fichier config.json
const mongoose = require('mongoose'); // Permet la communication avec MongoDB

module.exports = callback => {
    mongoose.connect(config.mongo.host, config.mongo.options)
        .then(() => callback())
        .catch(e => console.log(e));
}





