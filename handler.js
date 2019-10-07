const unirest = require('unirest');
const nodemailer = require('nodemailer');
const AWS = require("aws-sdk");
   

const config = {port: process.env.SMTP_PORT, host: process.env.SMTP_HOST, user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD, region: process.env.REGION}



module.exports = {
    send: (event, context) => {
        const transporter = nodemailer.createTransport({
            service: 'smtp',
            port: config.port,
            host: config.host,
            secure: true,
            auth: {
              user: config.user,
              pass: config.pass
            }
          });
          
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEYy
        })
    
        AWS.config.update({region: process.env.REGION});

        /** check mail server connection */
      
      /**  transporter.verify(function(error, success) {
            if (error) {
                 console.log(error);
            } else {
                 console.log('Server is ready to take our messages');
            }
         });
       */

        let _to = event.to;
        let _message = event.message;
        let _subject = event.subject;
        let error = [];

        if (!_to) error.push("Please input address you want to send the mail to");
        if (!_message) error.push("Please input message to send");
        if (!_subject) error.push("Subject is empty, try and input something");

        if (error.length == 0){
            var mailOptions = {
                from: 'DEVOPS NG admin@devops.ng',
                to: _to,
                subject: _subject,
                text: _message
              };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) 
                    context.succeed(error)
                else 
                 context.succeed('Email Sent ', info.response);
                
              });
        }else
            context.succeed(error)


    }
}




