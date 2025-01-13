import { Store } from '../schemas/store.schema';

export interface StoreResponse {
  status: string;
  store: Store;
}