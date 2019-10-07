const serverless = require("serverless-http");
var dotenv = require("dotenv").config();
var restify = require('restify')
var _config = require('./config/app.js')
var unirest = require('unirest');
var nodemailer = require('nodemailer');
var Resp = require("./helpers/Response");


    var server = restify.createServer({name: _config.app_name});
    
    server.pre(restify.pre.sanitizePath());
    
    
    var resp = function(res,data){
        res.header("Access-Control-Allow-Origin", "*");
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(data))
    };
    
    
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    
    
    server.listen(_config.api._port, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
    
    
    var transporter = nodemailer.createTransport({
        service: 'smtp',
        port: _config.smtp.port,
        host: _config.smtp.host,
        secure: true,
        auth: {
          user: _config.smtp.auth.user,
          pass: _config.smtp.auth.password
        }
      });
    
      /** check mail server connection */
      /**transporter.verify(function(error, success) {
            if (error) {
                 console.log(error);
            } else {
                 console.log('Server is ready to take our messages');
            }
         });
       * 
       */
    
    
    server.get("/", function (req, res) {
        resp(res, Resp.success({msg:'Email Notification Service'}))
    })
    
    server.post("/send", function (req, res) {
        var _message = req.body.message;
        var _to = req.body.to;
        var _subject = req.body.subject;
        var error = [];
    
        if (!_message) error.push('Message Missing!');
        if (!_to) error.push('Recipient Missing!');
        if (!_subject) error.push('Subject Missing!');
        
    
    
        if (error.length == 0){
            var mailOptions = {
                from: _config.smtp.auth.user,
                to: _to,
                subject: _subject,
                text: _message
              };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) 
                    return res.send(Resp.error({msg: error}));
                else 
                  return res.send(Resp.success({msg: 'Email sent: ' + info.response}));
                
              });
        }else
            return resp(res, Resp.success({msg:error}))
        
    
    })
        



