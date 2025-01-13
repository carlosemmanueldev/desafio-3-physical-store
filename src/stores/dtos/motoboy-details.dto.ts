import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MotoboyDetailsDto {
  @ApiProperty({
    description: 'Estimated delivery time for motoboy',
    example: '1 hour',
  })
  @Expose()
  deliveryTime: string;

  @ApiProperty({
    description: 'Price for motoboy delivery',
    example: '20.00',
  })
  @Expose()
  price: string;

  @ApiProperty({
    description: 'Description of the motoboy service',
    example: 'Fast delivery within the city',
  })
  @Expose()
  description: string;
}