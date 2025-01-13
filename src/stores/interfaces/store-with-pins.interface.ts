import { StoreWithDeliveryDto } from '../dtos/store-with-delivery.dto';
import { PinsDto } from '../dtos/pins.dto';

export interface StoreWithPins {
  stores: StoreWithDeliveryDto[];
  pins: PinsDto[];
  totalPages: number;
  totalStores: number;
  offset: number;
  limit: number;
}