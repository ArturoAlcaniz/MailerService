import {IsNotEmpty, IsString} from "class-validator";

export class CodeLoginDto {
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly code: string;
}
