const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path')

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err);                 
        }
        else {
            callback(null, html);
        }
    });
};


const transporter = nodemailer.createTransport({
    port: 587,
    host: 'smtp-relay.brevo.com',
    auth: {
        user: 'sukanto01899@gmail.com',
        pass: 'R0DkmrXxA5fvP2jV'
    }
})

  const sendEmail = ({to, subject, template, replace})=>{
    const __dirname = path.resolve();
    readHTMLFile(path.join(__dirname + `/public/email/transaction/${template}.html`) , function (err, html){
        if (err) {
           console.log('error reading file', err);
           return;
        }
        var template = handlebars.compile(html);
        var replacements = replace;
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'coingrip@atlasoftech.com',
            to : to,
            subject : subject,
            html : htmlToSend
         }


         transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err)
            }else{
                console.log('successfully send')
            }
        })
        
        })
  }

  module.exports = sendEmail;