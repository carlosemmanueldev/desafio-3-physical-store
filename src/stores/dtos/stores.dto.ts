import { Expose, Type } from 'class-transformer';
import { StoreDto } from './store.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StoresDto {
  @ApiProperty({
    description: 'Response status',
    example: 'success',
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'The amount of results you want per page',
    example: 5,
  })
  @Expose()
  limit?: number;

  @ApiProperty({
    description: 'The offset of the current page',
    example: 1,
  })
  @Expose()
  offset?: number;

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
    description: 'The list of stores',
    type: [StoreDto],
  })
  @Expose()
  @Type((): typeof StoreDto => StoreDto)
  stores: StoreDto[];
}