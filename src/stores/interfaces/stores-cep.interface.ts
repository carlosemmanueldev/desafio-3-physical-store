import { PinsDto } from '../dtos/pins.dto';
import { StoreWithDeliveryDto } from '../dtos/store-with-delivery.dto';

export interface StoresCep{
  status: string;
  stores: StoreWithDeliveryDto[];
  pins: PinsDto[];
  totalStores: number;
  totalPages: number;
  offset: number;
  limit: number;
}