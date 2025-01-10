import { Expose, Type } from 'class-transformer';
import { CorreiosDetails } from '../../correios/interfaces/correios.interface';

export class PinsDto {
  @Expose()
  position: {
    lat: number,
    lng: number
  }

  @Expose()
  title: string;
}

export class MultipleStoreWithPinsResponseDto {
  @Expose()
  name: string;

  @Expose()
  city: string;

  @Expose()
  postalCode: string;

  @Expose()
  type: string;

  @Expose()
  distance: string;

  @Expose()
  value: CorreiosDetails;

  @Expose()
  @Type(() => PinsDto)
  pins: PinsDto[];
}