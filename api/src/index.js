// Liens vers d'autres fichiers





const socketControl = require('./controller/notifications')



// Importation des modules

const bodyParser = require('body-parser') // Permet de récupérer les données envoyées sous format d'objet
const socket = require('socket.io') // Permet une communication en temps réels entre le navigateur et le serveur

const express = require("express"); // Permet la construction d'API et d'application web
const app = express(); // Création de l'application Express

const http = require('http'); // Permet une communication via le protocole HTTP
app.server = http.createServer(app); // Création du serveur HTTP


const io = socket.listen(app.server); 


// index.js
const config = require('./config'); 
const DbConnection = require('./db');

DbConnection(() => { // Lance la connexion de la base de donnée et définie le port utilisé.
    app.server.listen(process.env.PORT || config.port, () => {
        console.log('Serveur démarré sur le port ' + app.server.address().port)
    })
});


app.use(bodyParser.json());



app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});




// Socket.io 
io.on("connection", socket => socketControl.respond(socket))

// Passport
const passport = require('passport')
app.use(passport.initialize())



// index.js
const api = require('./api'); 
app.use('/api', api());
require("./passport-config/strategy");

