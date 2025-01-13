import { Store } from '../schemas/store.schema';

export interface PaginatedStore {
  stores: Store[];
  totalPages: number;
  totalStores: number;
  offset: number;
  limit: number;
}