import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { ViaCepService } from '../via-cep/via-cep.service';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { CorreiosService } from '../correios/correios.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { storeStub } from '../../test/stub/store.stub';
import { Model } from 'mongoose';
import { Store } from './schemas/store.schema';

describe('StoresService', () => {
  let service: StoresService;

  const mockStoreModel = {
    paginate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockViaCepService = {
    getAddressByCep: jest.fn(),
  };

  const mockGoogleMapsService = {
    getCoordinates: jest.fn(),
  };

  const mockCorreiosService = {
    getShippingCost: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getModelToken('Store'),
          useValue: mockStoreModel,
        },
        {
          provide: ViaCepService,
          useValue: mockViaCepService,
        },
        {
          provide: GoogleMapsService,
          useValue: mockGoogleMapsService,
        },
        {
          provide: CorreiosService,
          useValue: mockCorreiosService,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('Should return all stores paginated', async () => {
      const mockPaginatedResult = {
        docs: [storeStub()],
        totalPages: 1,
        totalDocs: 1,
        page: 1,
        limit: 10,
      };

      mockStoreModel.paginate.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAll(1, 10);

      expect(mockStoreModel.paginate).toHaveBeenCalledWith({}, { page: 1, limit: 10 });
      expect(result).toEqual({
        stores: mockPaginatedResult.docs,
        totalPages: mockPaginatedResult.totalPages,
        totalStores: mockPaginatedResult.totalDocs,
        offset: mockPaginatedResult.page,
        limit: mockPaginatedResult.limit,
      });
    });
  });

  describe('getById', () => {
    it('Should return a store if found', async () => {
      mockStoreModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(storeStub()) });

      const result = await service.getById('60f1e2b4c9e77c001f2e3c1b');

      expect(mockStoreModel.findById).toHaveBeenCalledWith('60f1e2b4c9e77c001f2e3c1b');
      expect(result).toEqual(storeStub());
    });

    it('Should throw an exception if the store is not found', async () => {
      mockStoreModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.getById('85b3e2b4c9e77c001f2e3c2f')).rejects.toThrow(new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND));
    });
  });

  describe('create', () => {
    it('Should create a new store', async () => {
      const mockStoreDto = {
        _id: storeStub()._id,
        name: storeStub().name,
        postalCode: storeStub().postalCode,
        takeOutInStore: true,
        shippingTimeInDays: storeStub().shippingTimeInDays,
        type: storeStub().type,
        district: storeStub().district,
        telephoneNumber: storeStub().telephoneNumber,
        emailAddress: storeStub().emailAddress,
      };

      mockViaCepService.getAddressByCep.mockResolvedValue({
        logradouro: 'Avenida Agamenon Magalhães',
        bairro: 'Maurício de Nassau',
        localidade: 'Caruaru',
        uf: 'PE',
        estado: 'Pernambuco',
        unidade: '',
      });

      mockGoogleMapsService.getCoordinates.mockResolvedValue({ lat: -23.55052, lng: -46.633308 });
      mockStoreModel.create.mockResolvedValue(storeStub());
      const result = await service.create(mockStoreDto);

      expect(result).toEqual(storeStub());
      expect(mockGoogleMapsService.getCoordinates).toHaveBeenCalled();
      expect(mockViaCepService.getAddressByCep).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('Should update a store if found', async () => {
      const updatedStore = storeStub();
      updatedStore.name = 'Updated Store';

      mockStoreModel.findByIdAndUpdate.mockResolvedValue(updatedStore);

      const result = await service.update(storeStub()._id, { name: 'Updated Store' });

      expect(mockStoreModel.findByIdAndUpdate).toHaveBeenCalledWith(storeStub()._id, { name: 'Updated Store' }, { new: true });
      expect(result).toEqual(updatedStore);
    });

    it('Should throw an exception if store is not found', async () => {
      mockStoreModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('85b3e2b4c9e77c001f2e3c2f', { name: 'Updated Store' })).rejects.toThrow(new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND));
    });
  });

  describe('delete', () => {
    it('Should delete a store if found', async () => {
      mockStoreModel.findByIdAndDelete.mockResolvedValue({ id: storeStub()._id });

      await service.delete(storeStub()._id);

      expect(mockStoreModel.findByIdAndDelete).toHaveBeenCalledWith(storeStub()._id);
    });

    it('Should throw an exception if store is not found', async () => {
      mockStoreModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.delete('85b3e2b4c9e77c001f2e3c2f')).rejects.toThrow(new HttpException('Store not found with that ID.', HttpStatus.NOT_FOUND));
    });
  });

  describe('getNearBy', () => {
    it('Should return near by stores based on postal code', async () => {
      mockViaCepService.getAddressByCep.mockResolvedValue({
        logradouro: 'Avenida Agamenon Magalhães',
        bairro: 'Maurício de Nassau',
        localidade: 'Caruaru',
        uf: 'PE',
        estado: 'Pernambuco',
        unidade: '',
      });
      mockGoogleMapsService.getCoordinates.mockResolvedValue({ lat: -23.55052, lng: -46.633308 });

      mockStoreModel.aggregate.mockResolvedValueOnce([{ totalStores: 1 }]);

      mockStoreModel.aggregate.mockResolvedValueOnce([
        {
          _id: storeStub()._id,
          name: storeStub().name,
          takeOutInStore: storeStub().takeOutInStore,
          shippingTimeInDays: storeStub().shippingTimeInDays,
          location: {
            coordinates: [-46.633308, -23.55052],
          },
          address1: storeStub().address1,
          address2: storeStub().address2,
          address3: storeStub().address3,
          city: storeStub().city,
          state: storeStub().state,
          type: storeStub().type,
          country: storeStub().country,
          postalCode: storeStub().postalCode,
          telephoneNumber: storeStub().telephoneNumber,
          emailAddress: storeStub().emailAddress,
          __v: 0,
          distance: 2.3,
        },
      ]);

      mockCorreiosService.getShippingCost.mockResolvedValue({
        sedex: {
          codProductAgencia: '40010',
          price: 'R$ 25,50',
          deliveryTime: '3 dias úteis',
          description: 'Sedex a encomenda expressa dos Correios'
        },
        pac: {
          codProductAgencia: '04510',
          price: "R$ 18,48",
          deliveryTime: "7 dias úteis",
          description: "PAC a encomenda economica dos Correios"
        }
      });

      const result = await service.getNearBy('55014470', 1, 10);
      expect(mockStoreModel.aggregate).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        stores: [
          {
            _id: storeStub()._id,
            name: storeStub().name,
            takeOutInStore: storeStub().takeOutInStore,
            shippingTimeInDays: storeStub().shippingTimeInDays,
            location: {
              coordinates: [-46.633308, -23.55052],
            },
            address1: storeStub().address1,
            address2: storeStub().address2,
            address3: storeStub().address3,
            city: storeStub().city,
            state: storeStub().state,
            type: storeStub().type,
            country: storeStub().country,
            postalCode: storeStub().postalCode,
            telephoneNumber: storeStub().telephoneNumber,
            emailAddress: storeStub().emailAddress,
            __v: 0,
            distance: '2.30 km',
            value: {
              deliveryTime: "0 horas e 3 minutos",
              price: 'R$ 15,00',
              description: 'Motoboy'
            }
          }
        ],
        pins: [
          {
            position: {
              lat: storeStub().location.coordinates[0],
              lng: storeStub().location.coordinates[1],
            },
            title: storeStub().name,
          },
        ],
        totalPages: 1,
        totalStores: 1,
        offset: 1,
        limit: 10,
      });
    });
  });

  describe('getByState', () => {
    it('Should return all stores of the state of PE', async () => {
      const mockPaginatedResult = {
        docs: [storeStub()],
        totalPages: 1,
        totalDocs: 1,
        page: 1,
        limit: 10,
      };

      mockStoreModel.paginate.mockResolvedValue(mockPaginatedResult);
      const result = await service.getByState('PE', 1, 10);

      expect(mockStoreModel.paginate).toHaveBeenCalledWith({ state: 'PE' }, { page: 1, limit: 10 });
      expect(result).toEqual({
        stores: mockPaginatedResult.docs,
        totalPages: mockPaginatedResult.totalPages,
        totalStores: mockPaginatedResult.totalDocs,
        offset: mockPaginatedResult.page,
        limit: mockPaginatedResult.limit,
      });
    });
  })
});