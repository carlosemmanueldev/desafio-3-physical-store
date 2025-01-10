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

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    private viaCepService: ViaCepService,
    private correiosService: CorreiosService,
    private googleMapsService: GoogleMapsService,
  ) {}

  getAll() {
    return this.storeModel.find().exec();
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

  update(id: string, attrs: Partial<Store>): Promise<Store> {
    const store = this.storeModel.findByIdAndUpdate(id, attrs, { new: true });

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  delete(id: string): Promise<Store> {
    const store = this.storeModel.findByIdAndDelete(id);

    if (!store) {
      throw new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async calculateCoordinates(cep: string) {
    const addressData: ViaCepResponse = await this.viaCepService.getAddressByCep(cep);
    const { logradouro, bairro, localidade, uf, estado, regiao } = addressData;
    const address: string = `${logradouro}, ${bairro}, ${localidade}, ${estado}`;
    const coordinates: LatLngLiteral = await this.googleMapsService.getCoordinates(address);

    return {
      address1: logradouro,
      address2: bairro,
      city: localidade,
      state: uf,
      coordinates: [coordinates.lng, coordinates.lat],
    };
  }

  async getNearBy(cep: string) {
    const { coordinates } = await this.calculateCoordinates(cep);

    const stores = await this.storeModel.aggregate([
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
    ]);

    const storesWithShippingCost = await Promise.all(
      stores.map(async (store) => {
        const shippingCost = await this.correiosService.getShippingCost(cep, store.postalCode);
        return {
          ...store,
          shippingCost,
        };
      }),
    );

    const pins = stores.map((store) => ({
      position: {
        lat: store.location.coordinates[1],
        lng: store.location.coordinates[0],
      },
      title: store.name,
    }));

    return {
      stores: storesWithShippingCost,
      pins: pins,
    };
  }

  async getByState(state: string, limit: number, page: number) {
    return this.storeModel.find({ state }).exec();
  }
}
