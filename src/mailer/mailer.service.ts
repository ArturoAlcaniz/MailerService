import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import { Invoice } from "@entities-lib/src/entities/invoice.entity";

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
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
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

            if (err) {
                console.log(err)
            } else {
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
                        path: path.resolve(__dirname, './templates/Login/Logo-TISHOP.png'),
                        cid: 'Logo-TISHOP'
                    }]
                };

                thisOut.transporter.sendMail(mailOptions, function (error) {
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

            if (err) {
                console.log(err)
            } else {
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
                        path: path.resolve(__dirname, './templates/Login/Logo-TISHOP.png'),
                        cid: 'Logo-TISHOP'
                    }]
                };

                thisOut.transporter.sendMail(mailOptions, function (error) {
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

            if (err) {
                console.log(err)
            } else {
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
                        path: path.resolve(__dirname, './templates/Register/Logo-TISHOP.png'),
                        cid: 'Logo-TISHOP'
                    }]
                };

                thisOut.transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })
    }

    public async sendInvoice(invoice: Invoice) {

        let thisOut = this

        const pdfPath = await this.generateInvoicePDF(invoice);

        this.readHTMLFile(path.resolve(__dirname, "./templates/Market/invoice.html"), function (err, html) {

            if (err) {
                console.log(err)
            } else {
                let template = handlebars.compile(html);
                let replacements = {
                    domain: process.env.DOMAIN
                };
                let htmlToSend = template(replacements);
                const mailOptions = {
                    from: thisOut.user,
                    to: invoice.buyer.email,
                    subject: "[TI-SHOP] Invoice",
                    html: htmlToSend,
                    attachments: [
                        {
                            filename: 'Logo-TISHOP',
                            path: path.resolve(__dirname, './templates/Register/Logo-TISHOP.png'),
                            cid: 'Logo-TISHOP'
                        },
                        {
                            filename: `invoice-${invoice.id}.pdf`,
                            path: pdfPath,
                            contentType: 'application/pdf'
                        }
                    ]
                };

                thisOut.transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })
    }

    public async generateInvoicePDF(invoice: Invoice): Promise<string> {
        try {
            const fonts = {
                Roboto: {
                    normal: path.join(__dirname, './fonts/Roboto-Regular.ttf'),
                    bold: path.join(__dirname, './fonts/Roboto-Medium.ttf'),
                    italics: path.join(__dirname, './fonts/Roboto-Italic.ttf'),
                    bolditalics: path.join(__dirname, './fonts/Roboto-MediumItalic.ttf')
                }
            };
            const PdfPrinter = require('pdfmake');
            const printer = new PdfPrinter(fonts);
    
            const pdfPath = path.join(__dirname, '..', '..', 'files', `invoice-${invoice.id}.pdf`);
    
            const docDefinition = this.createInvoice(invoice); // Utiliza la plantilla para generar el contenido del PDF
    
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
            const pdfBytes = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Uint8Array[] = [];
                pdfDoc.on('data', (chunk: Uint8Array) => {
                    chunks.push(chunk);
                });
                pdfDoc.on('end', () => {
                    const result = Buffer.concat(chunks);
                    resolve(result);
                });
                pdfDoc.on('error', (error: Error) => {
                    reject(error);
                });
                pdfDoc.end();
            });
    
            fs.writeFileSync(pdfPath, pdfBytes); // Guarda el archivo PDF
    
            return pdfPath;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            throw error;
        }
    }

    public createInvoice(invoice: Invoice): any {
        const imagePath = path.join(__dirname, './templates/Market', 'Logo-TISHOP.png');

        const tableBody = invoice.items.map((item, index) => [
            { text: `${index + 1}. ${item.product.productName}\nID: ${item.product.id}`, alignment: 'left', fontSize: 8 },
            { text: item.product.user.userName, alignment: 'left' },
            { text: item.product.price.toString(), alignment: 'right' }
        ]);
    
        const today = new Date();
        const formattedDate = `${today.getDate()} - ${this.getMonthName(today.getMonth())} ${today.getFullYear()}`;
    
        return {
            content: [
                {
                    alignment: 'center',
                    image: imagePath,
                    width: 100,
                    margin: [0, 10, 0, 10]
                },
                { text: 'Invoice', style: 'header', alignment: 'right', margin: [0, 0, 0, 0] },
                { text: `Invoice ID: ${invoice.id}`, fontSize: 8, alignment: 'right', margin: [0, -10, 0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: 'Product', style: 'tableHeader', alignment: 'left' },
                                { text: 'Seller', style: 'tableHeader', alignment: 'left' },
                                { text: 'Price', style: 'tableHeader', alignment: 'right' }
                            ],
                            ...tableBody
                        ]
                    }
                },
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            ['Payments Received', { text: invoice.price.toString(), alignment: 'right' }],
                            [formattedDate, '']
                        ]
                    },
                    margin: [0, 10, 0, 0]
                }
            ],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black'
                }
            },
        };
    }

    public getMonthName(month: number): string {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    
        return monthNames[month];
    }
}