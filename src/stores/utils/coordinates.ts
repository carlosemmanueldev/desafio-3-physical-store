import { ViaCepResponse } from '../../via-cep/interfaces/via-cep.interface';
import { LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { GoogleMapsService } from '../../google-maps/google-maps.service';
import { ViaCepService } from '../../via-cep/via-cep.service';
import { AddressData } from '../interfaces/address-data.interface';

export async function calculateCoordinates(cep: string, viaCepService: ViaCepService, googleMapsService: GoogleMapsService): Promise<AddressData> {
  const addressData: ViaCepResponse = await viaCepService.getAddressByCep(cep);
  const { logradouro, bairro, localidade, uf, estado, unidade } = addressData;
  const address: string = `${logradouro}, ${bairro}, ${localidade}, ${estado}`;
  const coordinates: LatLngLiteral = await googleMapsService.getCoordinates(address);

  return {
    address1: logradouro,
    address2: bairro,
    address3: unidade,
    city: localidade,
    state: uf,
    coordinates: [coordinates.lng, coordinates.lat],
  };
}

