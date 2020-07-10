// ------------------------------------ Modules ------------------------------------ //

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

// ------------------------------- Instanced Modules ------------------------------- //

const app = express();

// ------------------------- State Configuration Variables ------------------------- //

const routes = require('./routes');
const PORT = process.env.PORT || 5000;

// ----------------------------------- Middleware ---------------------------------- //

const ssm = new AWS.SSM({ region: 'us-west-1' });

const sessionSecretOptions = { Name: '/proclips/session-secret', WithDecryption: true };
const mongoDBUriOptions = { Name: '/proclips/mongodb-connection-string', WithDecryption: true }

let sessionSecret1;
let sessionSecret2;
let mongoDBURI1;
let mongoDBURI2;

ssm.getParameter(sessionSecretOptions)
    .promise()
    .then((error, data) => {
        if (error) return console.log(error, errorStack);

        console.log('Hello from getParam: sessionSecret 1', data);

        return sessionSecret1 = data;
    });

ssm.getParameter(mongoDBUriOptions)
    .promise()
    .then((error, data) => {
        if (error) return console.log(error, errorStack);

        console.log('Hello from getParam: MongoDBURI 1', data);

        return mongoDBURI1 = data;
    });

ssm.getParameter(sessionSecretOptions, (error, data) => {
    if (error) return console.log(error, errorStack);

    console.log('Hello from getParam: sessionSecret 2', data);

    return sessionSecret2 = data;
});

ssm.getParameter(mongoDBUriOptions, (error, data) => {
    if (error) return console.log(error, errorStack);

    console.log('Hello from getParam: MongoDBURI 2', data);

    return mongoDBURI2 = data;
});

console.log('Hello!!!', sessionSecret1);
console.log('Hello!!!', sessionSecret2);
console.log('Hello!!!', mongoDBURI1);
console.log('Hello!!!', mongoDBURI2);


// ----------------------------------------------------------- //


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: false
}));

const corsOptions = {
    origin: 'https://www.proclips.io',
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE', 'OPTIONS'],
    headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('https://www.proclips.io', cors());

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