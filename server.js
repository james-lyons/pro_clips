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

const sessionSecret = ssm.getParameter(sessionSecretOptions, (error, data) => {
    if (error) {
        console.log(error, errorStack);
        return;
    };

    return data.Parameter.value;
});

console.log('Hello!!!', sessionSecret);


// ----------------------------------------------------------- //


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: sessionSecret,
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