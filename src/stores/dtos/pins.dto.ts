import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PinsDto {
  @ApiProperty({
    description: 'Position of the store with latitude and longitude',
    example: { lat: -23.55052, lng: -46.633308 },
  })
  @Expose()
  position: {
    lat: number;
    lng: number;
  };

  @ApiProperty({
    description: 'Title or name of the store pin',
    example: 'My Store',
  })
  @Expose()
  title: string;
}