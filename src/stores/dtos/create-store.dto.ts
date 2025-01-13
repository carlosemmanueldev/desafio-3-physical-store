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
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
    @ApiProperty({
        description: 'Name of the store',
        example: 'My Store',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Indicates whether the store offers take-out in-store option',
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    takeOutInStore: boolean;

    @ApiProperty({
        description: 'Estimated shipping time in days',
        example: 3,
    })
    @IsInt()
    @IsPositive()
    shippingTimeInDays: number;

    @IsString()
    @IsOptional()
    district: string;

    @ApiProperty({
        description: 'Type of store',
        example: 'loja',
    })
    @IsString()
    @IsIn(['loja', 'pdv'])
    type: string;

    @ApiProperty({
        description: 'Postal code of the store location',
        example: '55014000',
    })
    @IsString()
    postalCode: string;

    @ApiProperty({
        description: 'Telephone number of the store',
        example: '(11) 1234-5678',
    })
    @IsString()
    @IsPhoneNumber('BR')
    telephoneNumber: string;

    @ApiProperty({
        description: 'Email address of the store',
        example: 'store@example.com',
    })
    @IsString()
    @IsEmail()
    emailAddress: string;
}