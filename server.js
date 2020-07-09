// ------------------------------------ Modules ------------------------------------ //

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

// ------------------------------- Instanced Modules ------------------------------- //

const app = express();

// const ssm = new AWS.SSM({ region:'us-west-1a' });

// const getSecret = async () => {

//     const params = {
//         Name: 'session-secret',
//         WithDecryption: false
//     };

//     try {
//         let result = await ssm.getParameter(params);
//         console.log('Hello from getSecret: Result', result);

//         return result.Parameter.Value;

//     } catch (error) {
//         console.log('Hello from getSecret: Error', error)
//         return error;
//     };
// };
// let secretSession = getSecret();


let credentials = new AWS.SharedIniFileCredentials({ profile: 'pro-clips' });
AWS.config.credentials = credentials;

console.log('Hello from server 1', AWS.config.credentials);

// console.log('Hello from getSecret 2: secretSession', secretSession)

// ------------------------- State Configuration Variables ------------------------- //

const routes = require('./routes');
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