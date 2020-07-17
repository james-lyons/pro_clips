// ------------------------- Modules ------------------------- //

const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// ----------------------- Middleware ------------------------ //

// AWS SES

// const params = {
//     Destination: {
//         ToAddresses: [
//             req.body.email
//         ]
//     },
//     Message: {
//         Body: {
//             Html: {
//                 Charset: "UTF-8",
//                 Data: "HTML_FORMAT_BODY"
//             },
//             Text: {
//                 Charset: "UTF-8",
//                 Data: "TEXT_FORMAT_BODY"
//             }
//         },
//         Subject: {
//             Charset: 'UTF-8',
//             Data: 'ProClips email verification'
//         }
//     },
//     Source: process.env.PROCLIPS_EMAIL,
//     ReplyToAddresses: [
//         process.env.PROCLIPS_EMAIL
//     ],
// };
    
// const sendPromise = new AWS.SES({
//     region: process.env.AWS_SES_REGION,
//     apiVersion: '2010-12-01'
// }).sendEmail(params).promise();
    
// sendPromise.then((data) => {
//     console.log(data.MessageId);
// }).catch((error) => {
//     console.error(error, error.stack);
// });


// Nodemailer

const sendMail = async (email, user) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.PROCLIPS_EMAIL,
            pass: process.env.EMAIL_PASS
        },
    });

    jwt.sign(
        { user },
        process.env.EMAIL_SECRET,
        { expiresIn: '1h' },
        (error, emailToken) => {

            if (error) return console.log(error);

            const url = `https://proclips-backend.com/auth/register/confirm/${ emailToken }`;
          
            transporter.sendMail({
                from: `"ProClips 🎥" <${ process.env.PROCLIPS_EMAIL }>`,
                to: email,
                subject: "ProClips email verification",
                html: `<p>Hi! Thanks for signing up. Please click the link below to confirm your email.</p><a href="${ url }">Click here to confirm</a>`
            });
        }
    );
};

module.exports = sendMail;
