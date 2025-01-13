import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { storeStub } from '../../test/stub/store.stub';

describe('StoresController', () => {
  let controller: StoresController;
  const mockStoreService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getNearBy: jest.fn(),
    getByState: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: mockStoreService,
        }
      ]
    }).compile();

    controller = module.get<StoresController>(StoresController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStore', () => {
    it('should create a store', async () => {
      const store = {
        name: storeStub().name,
        takeOutInStore: storeStub().takeOutInStore,
        shippingTimeInDays: storeStub().shippingTimeInDays,
        type: storeStub().type,
        postalCode: storeStub().postalCode,
        district: storeStub().district,
        telephoneNumber: storeStub().telephoneNumber,
        emailAddress: storeStub().emailAddress,
      };

      mockStoreService.create.mockResolvedValue(storeStub());

      const result = await controller.createStore(store);

      expect(result).toEqual({ status: 'success', store: storeStub() });
    });
  })

  describe('updateStore', () => {
    it('Should update a store', async () => {
      const updatedStore = storeStub();
      updatedStore.name = 'Updated Name';
      mockStoreService.update.mockResolvedValue(updatedStore);

      const result = await controller.updateStore(storeStub()._id, { name: 'Updated Name' });
      expect(result).toEqual({ status: 'success', store: updatedStore });
    });
  })

  describe('deleteStore', () => {
    it('Should delete a store', () => {
      mockStoreService.delete.mockResolvedValue(undefined);

      expect(controller.deleteStore(storeStub()._id)).resolves.toEqual(undefined);
    });
  })

  describe('getStoreById', () => {
    it('Should return the store with the given ID', () => {
      mockStoreService.getById.mockResolvedValue(storeStub());

      const result = controller.getStoreById(storeStub()._id);
      expect(result).resolves.toEqual({ status: 'success', store: storeStub() });
    });
  })

  describe('getAllStores', () => {
    it('should return all the stores', () => {
      mockStoreService.getAll.mockResolvedValue({
        stores: [storeStub()],
        totalPages: 1,
        totalStores: 1,
        offset: 1,
        limit: 10,
      });

      const stores = [storeStub()];

      const result = controller.listAll();

      expect(result).resolves.toEqual({ status: 'success', stores, totalStores: 1, totalPages: 1, offset: 1, limit: 10 });
    });
  })

  describe('getStoresByCep', () => {
    it('Should return near by stores based on postal code', () => {
      mockStoreService.getNearBy.mockResolvedValue({
        stores: [storeStub()],
        pins: [storeStub().location.coordinates],
        totalPages: 1,
        totalStores: 1,
        offset: 1,
        limit: 10,
      });

      const stores = [storeStub()];
      const pins = [storeStub().location.coordinates];

      const result = controller.getStoresByCep('55014470', 1, 10);

      expect(result).resolves.toEqual({ status: 'success', stores, pins, totalStores: 1, totalPages: 1, offset: 1, limit: 10 });
    });
  })

  describe('getStoresByState', () => {
    it('Should return all the stores of the state', () => {
      mockStoreService.getByState.mockResolvedValue({
        stores: [storeStub()],
        totalPages: 1,
        totalStores: 1,
        offset: 1,
        limit: 10,
      })

      const stores = [storeStub()];

      const result = controller.getStoresByState('PE');

      expect(result).resolves.toEqual({ status: 'success', stores, totalStores: 1, totalPages: 1, offset: 1, limit: 10 });
    });
  })
});
