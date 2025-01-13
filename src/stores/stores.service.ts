import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Store } from './schemas/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ViaCepService } from '../via-cep/via-cep.service';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { CorreiosService } from '../correios/correios.service';
import { CorreiosDetails, MotoboyDetails } from 'src/correios/interfaces/correios.interface';
import { PaginateModel, PaginateResult } from 'mongoose';
import { calculateCoordinates } from './utils/coordinates';
import { getMotoboyCost } from './utils/motoboy';
import { AddressData } from './interfaces/address-data.interface';
import { PaginatedStore } from './interfaces/paginated-store.interface';
import { StoreWithPins } from './interfaces/store-with-pins.interface';
import { PinsDto } from './dtos/pins.dto';
import { StoreWithDeliveryDto } from './dtos/store-with-delivery.dto';
import { StoreDistancePins } from './interfaces/store-distance-pins.interface';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @InjectModel(Store.name) private storeModelPag: PaginateModel<Store>,
    private viaCepService: ViaCepService,
    private correiosService: CorreiosService,
    private googleMapsService: GoogleMapsService,
  ) {}

  async getAll(offset: number = 1, limit: number = 10): Promise<PaginatedStore> {
    const result: PaginateResult<Store> = await this.storeModelPag.paginate({}, { page: offset, limit });

    return {
      stores: result.docs,
      totalPages: result.totalPages,
      totalStores: result.totalDocs,
      offset: result.page,
      limit: result.limit,
    };
  }

  async getById(id: string): Promise<Store> {
    const store: Document & Store = await this.storeModel.findById(id).exec();

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const addressData: AddressData = await calculateCoordinates(createStoreDto.postalCode, this.viaCepService, this.googleMapsService);
    const storeData: Partial<Store> = {
      ...createStoreDto,
      address1: addressData.address1,
      address2: addressData.address2,
      address3: addressData.address3,
      city: addressData.city,
      state: addressData.state,
      location: {
        type: 'Point',
        coordinates: [addressData.coordinates[0], addressData.coordinates[1]],
      },
    };

    return await this.storeModel.create(storeData);
  }

  async update(id: string, attrs: Partial<Store>): Promise<Store | null> {
    const store: Store & Document | null = await this.storeModel.findByIdAndUpdate(id, attrs, { new: true });

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async delete(id: string): Promise<void> {
    const store: Store & Document | null = await this.storeModel.findByIdAndDelete(id);

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return;
  }

  async getNearBy(cep: string, offset: number = 1, limit: number = 10): Promise<StoreWithPins> {
    const { coordinates } = await calculateCoordinates(cep, this.viaCepService, this.googleMapsService);

    const skip: number = (offset - 1) * limit;
    const totalStores: { totalStores: number }[] = await this.storeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [coordinates[0], coordinates[1]],
          },
          distanceField: 'distance',
          maxDistance: 100000,
          distanceMultiplier: 0.001,
          spherical: true,
        },
      },
      { $count: 'totalStores' },
    ]);

    const totalStoresCount: number = totalStores.length > 0 ? totalStores[0].totalStores : 0;
    const totalPages: number = Math.ceil(totalStoresCount / limit);

    const aggregation = await this.storeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [coordinates[0], coordinates[1]],
          },
          distanceField: 'distance',
          maxDistance: 100000,
          distanceMultiplier: 0.001,
          spherical: true,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const storesWithShippingCostAndPins: StoreDistancePins[] = await Promise.all(
      aggregation.map(async (store) => {
        let value: CorreiosDetails | MotoboyDetails;

        if (store.distance > 50 && store.type === 'loja') {
          value = await this.correiosService.getShippingCost(cep, store.postalCode);
        } else if (store.distance <= 50) {
          value = getMotoboyCost(store.distance);
        }

        if (!value) {
          return;
        }

        return {
          store: {
            ...store,
            value,
            distance: `${store.distance.toFixed(2)} km`,
          },
          pin: {
            position: {
              lat: store.location.coordinates[1],
              lng: store.location.coordinates[0],
            },
            title: store.name,
          },
        };
      })
    );


    const filteredStores: StoreDistancePins[] = storesWithShippingCostAndPins.filter((item) => item !== null && item !== undefined);
    const stores: StoreWithDeliveryDto[] = filteredStores.map((item) => item.store);
    const pins: PinsDto[] = filteredStores.map((item) => item.pin);

    return {
      stores: stores,
      pins: pins,
      totalPages,
      totalStores: totalStoresCount,
      offset,
      limit,
    };
  }

  async getByState(state: string, offset: number = 1, limit: number = 10): Promise<PaginatedStore> {
    const result: PaginateResult<Store> = await this.storeModelPag.paginate({ state }, { page: offset, limit });

    if (result.docs.length === 0) {
      throw new HttpException(`No stores found in the state of ${state}`, HttpStatus.NOT_FOUND);
    }

    return {
      stores: result.docs,
      totalPages: result.totalPages,
      totalStores: result.totalDocs,
      offset: result.page,
      limit: result.limit,
    };
  }
}