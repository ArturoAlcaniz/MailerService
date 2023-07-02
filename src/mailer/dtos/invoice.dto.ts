import {IsNotEmpty} from "class-validator";
import { Invoice } from "@entities-lib/src/entities/invoice.entity";

export class InvoiceDto {
    @IsNotEmpty()
    readonly invoice: Invoice;
}
