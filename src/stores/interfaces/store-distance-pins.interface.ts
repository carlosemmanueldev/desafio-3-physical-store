import { CorreiosDetailsDto } from '../dtos/correios-details.dto';
import { MotoboyDetailsDto } from '../dtos/motoboy-details.dto';
import { StoreDto } from '../dtos/store.dto';

export interface StoreDistancePins {
  store: StoreDto & {
    value: CorreiosDetailsDto | MotoboyDetailsDto;
    distance: string;
  };
  pin: {
    position: {
      lat: number;
      lng: number;
    };
    title: string;
  }
}