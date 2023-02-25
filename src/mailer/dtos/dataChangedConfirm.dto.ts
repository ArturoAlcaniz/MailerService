import {IsNotEmpty, IsString} from "class-validator";

export class DataChangedConfirmDto {
    @IsNotEmpty()
    @IsString()
    readonly email: string;
}
