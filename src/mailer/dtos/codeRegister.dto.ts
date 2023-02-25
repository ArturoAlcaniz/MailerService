import {IsNotEmpty, IsString} from "class-validator";

export class CodeRegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly code: string;
}
