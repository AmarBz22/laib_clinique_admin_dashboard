const nodemailer = require('nodemailer');

const sendEmail = (recipientEmail, subject, body) => {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.Mail_sender, // Replace with your email
            pass: process.env.Mail_sender_Pwd, // Replace with your email password or app password
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.Mail_sender, // Sender address
        to: recipientEmail, // Use the provided recipient email
        subject: subject, // Dynamic subject line
        text: body, // Plain text body of the email
        html: `<p>${body}</p>`, // HTML version of the body, if needed
    };

    // Send email with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return; // Exit early if there's an error
        }
        console.log('Email sent:', info.response);
    });
};

module.exports = sendEmail;
