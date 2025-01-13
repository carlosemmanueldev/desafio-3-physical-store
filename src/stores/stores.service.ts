import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Store } from './store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ViaCepService } from '../via-cep/via-cep.service';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { ViaCepResponse } from '../via-cep/interfaces/via-cep.interface';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { CorreiosService } from '../correios/correios.service';
import { CorreiosDetails, MotoboyDetails } from 'src/correios/interfaces/correios.interface';
import { PaginateModel } from 'mongoose';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @InjectModel(Store.name) private storeModelPag: PaginateModel<Store>,
    private viaCepService: ViaCepService,
    private correiosService: CorreiosService,
    private googleMapsService: GoogleMapsService,
  ) {
  }

  async getAll(offset: number = 1, limit: number = 10) {
    const result = await this.storeModelPag.paginate({}, { page: offset, limit });

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
    const addressData = await this.calculateCoordinates(createStoreDto.postalCode);
    const storeData = {
      ...createStoreDto,
      address1: addressData.address1,
      address2: addressData.address2,
      address3: addressData.address3,
      city: addressData.city,
      state: addressData.state,
      location: {
        type: 'Point',
        coordinates: addressData.coordinates,
      },
    };

    const createdStore = new this.storeModel(storeData);
    return createdStore.save();
  }

  async update(id: string, attrs: Partial<Store>): Promise<Store> {
    const store = await this.storeModel.findByIdAndUpdate(id, attrs, { new: true });

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async delete(id: string): Promise<void> {
    const store = await this.storeModel.findByIdAndDelete(id);

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return;
  }

  async calculateCoordinates(cep: string) {
    const addressData: ViaCepResponse = await this.viaCepService.getAddressByCep(cep);
    const { logradouro, bairro, localidade, uf, estado, unidade } = addressData;
    const address: string = `${logradouro}, ${bairro}, ${localidade}, ${estado}`;
    const coordinates: LatLngLiteral = await this.googleMapsService.getCoordinates(address);

    return {
      address1: logradouro,
      address2: bairro,
      address3: unidade,
      city: localidade,
      state: uf,
      coordinates: [coordinates.lng, coordinates.lat],
    };
  }

  async getNearBy(cep: string, offset: number = 1, limit: number = 10) {
    const { coordinates } = await this.calculateCoordinates(cep);

    const skip = (offset - 1) * limit;
    const totalStores = await this.storeModel.aggregate([
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

    const totalStoresCount = totalStores.length > 0 ? totalStores[0].totalStores : 0;
    const totalPages = Math.ceil(totalStoresCount / limit);

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

    const storesWithShippingCostAndPins = await Promise.all(
      aggregation.map(async (store) => {
        let value: CorreiosDetails | MotoboyDetails;

        if (store.distance > 50 && store.type === 'loja') {
          value = await this.correiosService.getShippingCost(cep, store.postalCode);
        } else if (store.distance <= 50) {
          value = this.getMotoboyCost(store.distance);
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

    const filteredStores = storesWithShippingCostAndPins.filter((item) => item !== null && item !== undefined);
    const stores = filteredStores.map((item) => item.store);
    const pins = filteredStores.map((item) => item.pin);

    return {
      stores: stores,
      pins: pins,
      totalPages,
      totalStores: totalStoresCount,
      offset,
      limit,
    };
  }

  async getByState(state: string, offset: number = 1, limit: number = 10) {
    const result = await this.storeModelPag.paginate({ state }, { page: offset, limit });

    return {
      stores: result.docs,
      totalPages: result.totalPages,
      totalStores: result.totalDocs,
      offset: result.page,
      limit: result.limit,
    };
  }

  getMotoboyCost(distance: number) {
    const timeInHours = distance / 40;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);

    return {
      deliveryTime: `${hours} horas e ${minutes} minutos`,
      price: 'R$ 15,00',
      description: 'Motoboy'
    }
  }
}
