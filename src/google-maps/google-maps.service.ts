import { Client, GeocodeResponse, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleMapsService extends Client {
  constructor(private configService: ConfigService) {
    super();
  }

  async getCoordinates(address: string): Promise<LatLngLiteral> {
    const googleRes: GeocodeResponse = await this.geocode({
      params: {
        region: 'br',
        address: address,
        key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
      },
    });

    const { lat, lng }: LatLngLiteral = googleRes.data.results[0].geometry.location;

    return {
      lat: lat,
      lng: lng,
    };
  }
}