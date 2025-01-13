import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { StoreWithDeliveryDto } from './store-with-delivery.dto';

export class StoresWithPinsDto {
  @ApiProperty({
    description: 'Response status',
    example: 'success',
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'The offset of the current page',
    example: 1,
  })
  @Expose()
  offset?: number;

  @ApiProperty({
    description: 'The amount of results you want per page',
    example: 5,
  })
  @Expose()
  limit?: number;

  @ApiProperty({
    description: 'The total number of stores',
    example: 10,
  })
  @Expose()
  totalStores: number;

  @ApiProperty({
    description: 'The total number of pages',
    example: 2,
  })
  @Expose()
  totalPages: number;

  @ApiProperty({
    description: 'List of stores with delivery details',
    type: [StoreWithDeliveryDto],
  })
  @Expose()
  @Type(() => StoreWithDeliveryDto)
  stores: StoreWithDeliveryDto[];

  @ApiProperty({
    description: 'List of pins representing stores on a map',
    type: [StoresWithPinsDto],
  })
  @Expose()
  @Type(() => StoresWithPinsDto)
  pins: StoresWithPinsDto[];
}
