import {Injectable} from "@nestjs/common";
import nodemailer from "nodemailer";
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

@Injectable()
export class MailerService {
    private user = "no-reply@tishoptfg.com";
    private pass = process.env.EMAIL_PASS;
    private transporter = nodemailer.createTransport({
        host: "send.one.com",
        port: 465,
        secure: true,
        auth: {
            user: this.user,
            pass: this.pass,
        },
    });

    constructor() {
        //do nothing
    }

    readHTMLFile(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
               callback(err); 
               throw err;
                
            }
            else {
                callback(null, html);
            }
        });
    };    

    public async sendDataChangedConfirm(email: string) {

        let thisOut = this

        this.readHTMLFile(path.resolve(__dirname, "./templates/ChangeProfile/changeProfile.html"), function (err, html) {
 
            if(err){
                console.log(err)
            }else{
                let template = handlebars.compile(html);
                let replacements = {
                    domain: process.env.DOMAIN
                };
                let htmlToSend = template(replacements);
                const mailOptions = {
                    from: thisOut.user,
                    to: email,
                    subject: "[TI-SHOP] Profile changed",
                    html: htmlToSend,
                    attachments: [{
                        filename: 'Logo-TISHOP',
                        path: path.resolve(__dirname,'./templates/Login/Logo-TISHOP.png'),
                        cid: 'Logo-TISHOP'
                    }]
                };
        
                thisOut.transporter.sendMail(mailOptions, function(error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })
    }

    public async sendCodeLogin(email: string, code: string) {

        let thisOut = this

        this.readHTMLFile(path.resolve(__dirname, "./templates/Login/login.html"), function (err, html) {
 
            if(err){
                console.log(err)
            }else{
                let template = handlebars.compile(html);
                let replacements = {
                    code: code,
                    domain: process.env.DOMAIN
                };
                let htmlToSend = template(replacements);
                const mailOptions = {
                    from: thisOut.user,
                    to: email,
                    subject: "[TI-SHOP] Login Code",
                    html: htmlToSend,
                    attachments: [{
                        filename: 'Logo-TISHOP',
                        path: path.resolve(__dirname,'./templates/Login/Logo-TISHOP.png'),
                        cid: 'Logo-TISHOP'
                    }]
                };
        
                thisOut.transporter.sendMail(mailOptions, function(error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })
    }

    public async sendCodeRegister(email: string, code: string) {

        let thisOut = this

        this.readHTMLFile(path.resolve(__dirname, "./templates/Register/register.html"), function (err, html) {
 
            if(err){
                console.log(err)
            }else{
                let template = handlebars.compile(html);
                let replacements = {
                    code: code,
                    domain: process.env.DOMAIN
                };
                let htmlToSend = template(replacements);
                const mailOptions = {
                    from: thisOut.user,
                    to: email,
                    subject: "[TI-SHOP] Register Code",
                    html: htmlToSend,
                    attachments: [{
                        filename: 'Logo-TISHOP',
                        path: path.resolve(__dirname,'./templates/Register/Logo-TISHOP.png'),
                        cid: 'Logo-TISHOP'
                    }]
                };
        
                thisOut.transporter.sendMail(mailOptions, function(error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })
    }
}
