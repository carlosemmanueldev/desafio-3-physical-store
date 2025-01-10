import { Client, GeocodeResponse, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    const coordinates: LatLngLiteral = googleRes.data.results[0].geometry.location;

    if (!coordinates) {
      throw new HttpException('Address not found.', HttpStatus.NOT_FOUND);
    }

    return coordinates;
  }
}