import { Expose, Type } from 'class-transformer';
import { StoreDto } from './store.dto';

export class MultipleStoresDto {
  @Expose()
  status: string;

  @Expose()
  limit: number;

  @Expose()
  offset: number;

  @Expose()
  totalStores: number;

  @Expose()
  totalPages: number;

  @Expose()
  @Type(() => StoreDto)
  stores: StoreDto[];
}