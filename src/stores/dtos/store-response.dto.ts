import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { StoreDto } from './store.dto';

export class StoreResponseDto {
  @ApiProperty({
    description: 'Response status',
    example: 'success',
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Details of the store',
    type: StoreDto,
  })
  @Expose()
  @Type((): typeof StoreDto => StoreDto)
  store: StoreDto;
}