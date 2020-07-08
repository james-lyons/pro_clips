// ------------------------------------ Modules ------------------------------------ //

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

// ------------------------------- Instanced Modules ------------------------------- //

const app = express();

const ssm = new AWS.SSM();

let secretSession;

const getParams = async () => {
    const params = { Name: 'session-secret', WithDecryption: false };

    let res = await ssm.getParameter(params, (error, data) => {
        if (error) return console.log('Hello from getParams 1: error', error);

        secretSession = data;
        return console.log(secretSession);
    });
};

getParams();

console.log('Hello from secreSession 3: secretSesstion', secretSession);

// ------------------------- State Configuration Variables ------------------------- //

const routes = require('./routes');
const { SNS } = require('aws-sdk');
const PORT = process.env.PORT || 4000;

// ----------------------------------- Middleware ---------------------------------- //

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

const corsOptions = {
    origin: 'https://master.d1ypoilx07vzpv.amplifyapp.com',
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE', 'OPTIONS'],
    headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('https://master.d1ypoilx07vzpv.amplifyapp.com', cors());

// ------------------------------------- Routes ------------------------------------ //

app.get('/', (req, res) => {
    res.send('<h1> Henlo </h1>');
});

app.use('/auth', routes.auth);
app.use('/accounts', routes.accounts);
app.use('/follow', routes.follow);
app.use('/comments', routes.comments);
app.use('/replies', routes.replies);
app.use('/clips', routes.clips);
app.use('/report', routes.reports);


// --------------------------------- Server Listener ------------------------------ //

app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`);
});