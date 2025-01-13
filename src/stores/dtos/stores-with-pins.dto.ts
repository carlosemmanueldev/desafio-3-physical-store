import { Expose, Type } from 'class-transformer';

export class StoresWithPinsDto {
  @Expose()
  position: {
    lat: number,
    lng: number
  }

  @Expose()
  title: string;
}

export class CorreiosDetailsDto {
  @Expose()
  sedex: {
    codProductAgencia: string;
    price: string;
    deliveryTime: string;
    description: string;
  }

  @Expose()
  pac: {
    codProductAgencia: string;
    price: string;
    deliveryTime: string;
    description: string;
  }
}

export class MotoboyDetailsDto {
  @Expose()
  deliveryTime: string;

  @Expose()
  price: string;

  @Expose()
  description: string;
}

export class StoreWithDeliveryDto {
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
  value: CorreiosDetailsDto | MotoboyDetailsDto;
}

export class MultipleStoreWithPinsResponseDto {
  @Expose()
  status: string;

  @Expose()
  offset: number;

  @Expose()
  limit: number;

  @Expose()
  totalStores: number;

  @Expose()
  totalPages: number;

  @Expose()
  @Type(() => StoreWithDeliveryDto)
  stores: StoreWithDeliveryDto[];

  @Expose()
  @Type(() => StoresWithPinsDto)
  pins: StoresWithPinsDto[];
}