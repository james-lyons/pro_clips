// ------------------------- Modules ------------------------- //

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// ----------------------- Middleware ------------------------ //

// AWS SES

const sendEmailVerification = async (user) => {
    const emailToken = await jwt.sign({ userId: user._id }, process.env.EMAIL_SECRET, { expiresIn: '1d' });
    const url = `https://proclips.io/register/confirm?emailtoken=${ emailToken }`;

    console.log('Hello from EmailVerification: url', url);

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
                    Data: `<p>Hello ${ user.username }! Thanks for signing up. Please click the link below to confirm your email.</p><a href="${ url }">Click here to confirm</a>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'ProClips Email Verification'
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
        console.log('Hello from sendMail', data.MessageId);
    }).catch((error) => {
        console.error(error, error.stack);
    });
};

const sendPasswordChangeEmail = async (user) => {
    const emailSecret = user.password + '-' + user.createdAt;
    const emailToken = await jwt.sign({ userId: user._id, passhash: user.password }, emailSecret, { expiresIn: '1d' });

    const url = `https://proclips.io/password/reset/?userid=${ user._id }&token=${ emailToken }`;
    console.log('Hello from sendPasswordChangeEmail: url', url);

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
                    Data: `<p>Hello ${ user.username }, you recently requested to have your password reset. Please click the link below to be taken to the password reset portal. <b>Note that the link will only be valid for 24 hours. </b></p><a href='${ url }'>Click here to reset password</a><p>If you did not request as password reset, please ignore this email or contact us at proclipshelp@gmail.com</p><p>Thanks,</p><p>ProClips</p>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'ProClips Password Reset'
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
        console.log('Hello from sendMail', data.MessageId);
    }).catch((error) => {
        console.error(error, error.stack);
    });
};

module.exports = {
    sendEmailVerification,
    sendPasswordChangeEmail
}
