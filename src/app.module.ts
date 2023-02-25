import {Response} from "express";
import {ConfigModule} from "@nestjs/config";
import {AppController} from "./app.controller";
import {
    Module,
    NestMiddleware,
    MiddlewareConsumer,
} from "@nestjs/common";
import path from "path";
import {ThrottlerModule} from "@nestjs/throttler";
import {WinstonModule} from "nest-winston";
import * as winston from "winston";
import {MailerModule} from "./mailer/mailer.module";

const resolvePath = (file: string) => path.resolve(`./dist/ui_v1/${file}`);

class FrontendMiddleware implements NestMiddleware {
    use(res: Response) {
        res.sendFile(resolvePath("index.html"));
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        MailerModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        WinstonModule.forRoot({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    dirname: path.join(__dirname, "./../log/info/"),
                    filename: "info.log",
                    level: "info",
                }),
            ],
        }),
    ],
    providers: [],
    controllers: [AppController],
    exports: [WinstonModule, ThrottlerModule],
})
export class ApplicationModule {
    configure(frontEnd: MiddlewareConsumer) {
        frontEnd.apply(FrontendMiddleware);
    }
}
