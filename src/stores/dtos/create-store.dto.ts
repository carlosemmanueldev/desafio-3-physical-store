import {
    IsBoolean,
    IsEmail,
    IsIn,
    IsInt, IsOptional,
    IsPhoneNumber,
    IsPositive,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateStoreDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsBoolean()
    @IsOptional()
    takeOutInStore: boolean;

    @IsInt()
    @IsPositive()
    shippingTimeInDays: number;

    @IsString()
    @IsOptional()
    address3: string;

    @IsString()
    @IsOptional()
    district: string;

    @IsString()
    @IsIn(['loja', 'pdv'])
    type: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    postalCode: string;

    @IsString()
    @IsPhoneNumber('BR')
    telephoneNumber: string;

    @IsString()
    @IsEmail()
    emailAddress: string;
}