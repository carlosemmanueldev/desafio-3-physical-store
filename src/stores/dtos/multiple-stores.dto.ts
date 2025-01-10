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
  total: number;

  @Expose()
  @Type(() => StoreDto)
  stores: StoreDto[];
}