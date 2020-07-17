// ------------------------- Modules ------------------------- //

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// ----------------------- Middleware ------------------------ //

// AWS SES

const sendMail = async (user) => {
    let emailToken = await jwt.sign({ user }, process.env.EMAIL_SECRET);

    const url = `https://proclips-backend.com/auth/register/confirm/${ emailToken }`;

    const params = {
        Destination: {
            ToAddresses: [
                user.email
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `<p>Hi! Thanks for signing up. Please click the link below to confirm your email.</p><a href="${ url }">Click here to confirm</a>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'ProClips email verification'
            }
        },
        Source: process.env.PROCLIPS_EMAIL,
        ReplyToAddresses: [
            process.env.PROCLIPS_EMAIL
        ],
    };

    const sendPromise = new AWS.SES({
        region: process.env.AWS_SES_REGION,
        apiVersion: '2010-12-01'
    }).sendEmail(params).promise();

    await sendPromise.then((data) => {
        console.log(data.MessageId);
    }).catch((error) => {
        console.error(error, error.stack);
    });
};

module.exports = sendMail;
