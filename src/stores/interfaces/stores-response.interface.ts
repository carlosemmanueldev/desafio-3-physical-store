import { Store } from '../schemas/store.schema';

export interface StoresResponse {
  status: string;
  stores: Store[];
  totalStores: number;
  totalPages: number;
  offset: number;
  limit: number;
}