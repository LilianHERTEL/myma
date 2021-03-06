/*********************************************************************************************
 * Backend API, responsible for sending emails
 *********************************************************************************************/
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

// Creates the nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  provider: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "email@address.com", // Enter here email address from which you want to send emails
    pass: "2tWNyGdyRg5feWm", // Enter here password for email account from which you want to send emails
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/send", function (req, res) {
  // Retrieves all the data from the form fields
  let senderName = req.body.contactFormName;
  let senderEmail = req.body.contactFormEmail;
  let messageSubject = req.body.contactFormSubjects;
  let messageText = req.body.contactFormMessage;

  // Formats the message so that it is displayed properly as an email
  let formattedMessage = `- ${messageSubject} -\n\nFrom: ${senderName}\nEmail: ${senderEmail}\n\n- Request message - \n\n\t${messageText}`;

  // The email object
  let mailOptions = {
    to: "lilianhertelwifiplug@gmail.com", // Email address on which you want to send emails from your customers
    from: senderName,
    subject: messageSubject,
    text: formattedMessage,
    replyTo: senderEmail,
  };

  // Checks the data from the form fields
  if (
    senderName === "" ||
    senderEmail === "" ||
    messageSubject === "" ||
    messageText === ""
  ) {
    res.status(400);
    res.send({
      message: "Bad request",
    });
    return;
  }

  // Attempts to send the email
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: ", response);
      res.end("sent");
    }
  });
});

// Starts the server on the given port
app.listen(port, function () {
  console.log("Express started on port: ", port);
});
