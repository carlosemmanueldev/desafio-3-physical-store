import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CorreiosDetailsDto {
  @ApiProperty({
    description: 'Details for SEDEX delivery',
    example: {
      codProductAgencia: '40010',
      price: '25.50',
      deliveryTime: '2',
      description: 'SEDEX delivery service',
    },
  })
  @Expose()
  sedex: {
    codProductAgencia: string;
    price: string;
    deliveryTime: string;
    description: string;
  };

  @ApiProperty({
    description: 'Details for PAC delivery',
    example: {
      codProductAgencia: '41106',
      price: '15.30',
      deliveryTime: '5',
      description: 'PAC delivery service',
    },
  })
  @Expose()
  pac: {
    codProductAgencia: string;
    price: string;
    deliveryTime: string;
    description: string;
  };
}