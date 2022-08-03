// Imports

const express = require('express');
require('dotenv').config();
require('./config/config');
const apiRouter = require('./Routes/users.routes').router;

// Instantiate server

const app = express();

// Parser config

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Routes config

app.get('/', (req, res) => {
    res.status(200).send('Serveur en marche');
});

app.use('/api/', apiRouter);

// Server launch

app.listen(process.env.APP_PORT, () => {
    console.log(`Serveur en écoute sur ${process.env.APP_PORT} FM :)`);
});