const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const async = require('async');
const bodyParser = require('body-parser');
const helmet = require('helmet');
app.use(helmet()); //It's best to use Helmet early in your middleware stack so that its headers are sure to be set

const batches = require('./controllers/batchController');
const consumptions = require('./controllers/consumptionController');
const animalGroups = require('./controllers/animalGroupController');

require('dotenv').config();

const port = process.env.PORT;
const host = process.env.HOST;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const sessionSec = process.env.SESSION_SEC;
const username = process.env.APP_USERNAME;
const password = process.env.APP_PASSWORD;

const dbUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`;

const authCheck = (req, res, next) => {
    if (!req.session.userName) {
        res.send('You are not authorized to view this page');
    } else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    }
};

app.set('view engine', 'ejs');
app.use(session({secret: sessionSec, saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    if (!req.session.userName) {
        res.render('pages/loginPage');
    } else {
        res.redirect('/start');
    }
});

app.use('/start', authCheck, (req, res) => {
    res.render('pages/index');
});

app.use('/batches', authCheck, batches);
app.use('/consumptions', authCheck, consumptions);
app.use('/animalGroups', authCheck, animalGroups);

app.get('/loginPage', (req, res) => {
    res.render('pages/loginPage');
});

app.post('/login', (req, res) => {
    const body = req.body;
    if (body.userName === username && body.password === password) {
        const session = req.session;
        session.userName = body.userName;
        res.redirect('/start');
    } else {
        res.send('Wrong username or password :(');
    }
});

app.post('/logout', function (req, res) {
    delete req.session.userName;
    res.redirect('/loginPage');
});

mongoose.connect(dbUrl, {useNewUrlParser: true}).catch(error => {
    console.log(error);
});

app.listen(port, host, () => {
    console.log(`Server running at ${host}:${port}`);
});
