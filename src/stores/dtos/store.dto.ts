import { Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'bson';

export class StoreDto {
  @Expose()
  @Transform(params => params.obj._id)
  _id: ObjectId;

  @Expose()
  name: string;

  @Expose()
  takeOutInStore: boolean;

  @Expose()
  shippingTimeInDays: number;

  @Transform(({ obj }) => ({
    lat: obj.location.coordinates[1],
    lon: obj.location.coordinates[0],
  }))
  @Expose()
  coordinates: { lat: number; lon: number };

  @Expose()
  address1: string;

  @Expose()
  address2: string;

  @Expose()
  address3: string;

  @Expose()
  city: string;

  @Expose()
  district: string;

  @Expose()
  state: string;

  @Expose()
  country: string;

  @Expose()
  type: string;

  @Expose()
  postalCode: string;

  @Expose()
  telephoneNumber: string;

  @Expose()
  emailAddress: string;
}

export class StoreResponseDto {
  @Expose()
  status: string;

  @Expose()
  @Type(() => StoreDto)
  store: StoreDto;
}