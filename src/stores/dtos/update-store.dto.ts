import { IsEmail, IsIn, IsInt, IsOptional, IsPhoneNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class UpdateStoreDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  shippingTimeInDays: number;

  @IsString()
  @IsOptional()
  address1: string;

  @IsString()
  @IsOptional()
  address2: string;

  @IsString()
  @IsOptional()
  address3: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsIn(['loja', 'pdv'])
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  postalCode: string;

  @IsString()
  @IsPhoneNumber('BR')
  @IsOptional()
  telephoneNumber: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  emailAddress: string;
}