import {Body, Inject, Post, Res, Controller} from "@nestjs/common";
import {Response} from "express";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {Logger} from "winston";
import { DataChangedConfirmDto } from "./dtos/dataChangedConfirm.dto"
import { CodeLoginDto } from "./dtos/codeLogin.dto"
import { CodeRegisterDto } from "./dtos/codeRegister.dto"
import { MailerService } from "./mailer.service";
import { Invoice } from "@entities-lib/src/entities/invoice.entity";
import { InvoiceDto } from "./dtos/invoice.dto";

@ApiTags("Mailer Controller")
@Controller("mailer")
export class MailerController {
    constructor(
        private mailerService: MailerService,
        @Inject("winston")
        private readonly logger: Logger
    ) {}

    @ApiOkResponse()
    @Post("sendDataChangedConfirm")
    async dataChangedEmail(
        @Body() payload: DataChangedConfirmDto,
        @Res({passthrough: true}) response: Response
    ) {
        this.mailerService.sendDataChangedConfirm(payload.email);
        this.logger.info(`sendDataChangedConfirm Email Sent to ${payload.email}`);
        response.status(200);
    }

    @ApiOkResponse()
    @Post("sendCodeLogin")
    async codeLogin(
        @Body() payload: CodeLoginDto,
        @Res({passthrough: true}) response: Response
    ) {
        this.mailerService.sendCodeLogin(payload.email, payload.code);
        this.logger.info(`sendCodeLogin Email Sent to ${payload.email}`);
        response.status(200);
    }

    @ApiOkResponse()
    @Post("sendCodeRegister")
    async codeRegister(
        @Body() payload: CodeRegisterDto,
        @Res({passthrough: true}) response: Response
    ) {
        this.mailerService.sendCodeRegister(payload.email, payload.code);
        this.logger.info(`sendCodeRegister Email Sent to ${payload.email}`);
        response.status(200);
    }

    @ApiOkResponse()
    @Post("sendInvoice")
    async sendIncoice(
        @Body() payload: InvoiceDto,
        @Res({passthrough: true}) response: Response
    ) {
        this.logger.info(
            "Checkout: {INVOICE}".replace("{INVOICE}", JSON.stringify(payload.invoice))
        );
        this.mailerService.sendInvoice(payload.invoice);
        this.logger.info(`sendInvoice Email Sent to ${payload.invoice.buyer.email}`);
        response.status(200);
    }
}