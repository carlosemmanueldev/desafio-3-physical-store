import { StoreType } from '../../src/stores/dtos/store.dto';

export const storeStub = () => {
  return {
    _id: '60f1e2b4c9e77c001f2e3c1b',
    name: 'My Store',
    takeOutInStore: true,
    shippingTimeInDays: 3,
    location: {
      coordinates: [
        -23.55052,
        -46.633308,
      ],
    },
    address1: 'Avenida Agamenon Magalhães',
    address2: 'Maurício de Nassau',
    address3: 'de 694/695 ao fim',
    city: 'Caruaru',
    district: 'Centro',
    state: 'PE',
    country: 'BR',
    type: StoreType.LOJA,
    postalCode: '55014000',
    telephoneNumber: '1112345678',
    emailAddress: 'store@example.com',
  };
};