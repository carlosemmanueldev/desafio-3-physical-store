import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class StoreDto {
  @ApiProperty({
    description: 'Unique identifier of the store',
    example: '63d9f9f9f9f9f9f9f9f9f9f9',
  })
  @Expose()
  @Transform(params => params.obj._id)
  _id: ObjectId;

  @ApiProperty({
    description: 'Name of the store',
    example: 'My Store',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Indicates whether the store offers take-out in-store option',
    example: true,
  })
  @Expose()
  takeOutInStore: boolean;

  @ApiProperty({
    description: 'Estimated shipping time in days',
    example: 3,
  })
  @Expose()
  shippingTimeInDays: number;

  @ApiProperty({
    description: 'Coordinates of the store',
    example: { coordinates: { lat: -23.55052, lon: -46.633308 } },
  })
  @Transform(({ obj }) => ({
    lat: obj.location.coordinates[1],
    lon: obj.location.coordinates[0],
  }))
  @Expose()
  coordinates: { lat: number; lon: number };

  @ApiProperty({
    description: 'Primary address line of the store',
    example: 'Avenida Agamenon Magalhães',
  })
  @Expose()
  address1: string;

  @ApiProperty({
    description: 'Secondary address line of the store',
    example: 'Maurício de Nassau',
  })
  @Expose()
  address2: string;

  @ApiProperty({
    description: 'Tertiary address line of the store',
    example: 'de 694/695 ao fim',
  })
  @Expose()
  address3: string;

  @ApiProperty({
    description: 'City where the store is located',
    example: 'Caruaru',
  })
  @Expose()
  city: string;

  @ApiProperty({
    description: 'District where the store is located',
    example: 'Centro',
  })
  @Expose()
  district: string;

  @ApiProperty({
    description: 'State where the store is located',
    example: 'PE',
  })
  @Expose()
  state: string;

  @ApiProperty({
    description: 'Country where the store is located',
    example: 'BR',
  })
  @Expose()
  country: string;

  @ApiProperty({
    description: 'Type of store',
    example: 'loja',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Postal code of the store location',
    example: '55014000',
  })
  @Expose()
  postalCode: string;

  @ApiProperty({
    description: 'Telephone number of the store',
    example: '(11) 1234-5678',
  })
  @Expose()
  telephoneNumber: string;

  @ApiProperty({
    description: 'Email address of the store',
    example: 'store@example.com',
  })
  @Expose()
  emailAddress: string;
}