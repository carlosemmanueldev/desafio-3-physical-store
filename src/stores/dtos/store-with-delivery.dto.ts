import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MotoboyDetailsDto } from './motoboy-details.dto';
import { CorreiosDetailsDto } from './correios-details.dto';

export class StoreWithDeliveryDto {
  @ApiProperty({
    description: 'Name of the store',
    example: 'My Store',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'City where the store is located',
    example: 'São Paulo',
  })
  @Expose()
  city: string;

  @ApiProperty({
    description: 'Postal code of the store',
    example: '55014000',
  })
  @Expose()
  postalCode: string;

  @ApiProperty({
    description: 'Type of the store',
    example: 'loja',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Distance to the store',
    example: '5.2 km',
  })
  @Expose()
  distance: string;

  @ApiProperty({
    description: 'Delivery options available for the store',
    example: {
      sedex: {
        codProductAgencia: '04014',
        price: 'R$ 25,50',
        deliveryTime: '3 dias úteis',
        description: 'Sedex a encomenda expressa dos Correios',
      },
      pac: {
        codProductAgencia: '04510',
        price: 'R$ 15,30',
        deliveryTime: '5 dias úteis',
        description: 'PAC a encomenda econômica dos Correios',
      },
    },
  })
  @Expose()
  value: CorreiosDetailsDto | MotoboyDetailsDto;
}