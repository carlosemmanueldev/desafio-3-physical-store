import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CorreiosDetails, CorreiosResponse } from './interfaces/correios.interface';

@Injectable()
export class CorreiosService {
  constructor(private httpService: HttpService) {}

  async getShippingCost(cepDestino: string, cepOrigem: string): Promise<CorreiosDetails> {
    const { data }: AxiosResponse<CorreiosResponse> = await firstValueFrom(
      this.httpService.post<CorreiosResponse>('https://www.correios.com.br/@@precosEPrazosView',
        {
          cepDestino: cepDestino,
          cepOrigem: cepOrigem,
          comprimento: '20',
          largura: '20',
          altura: '20',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException('Error getting shipping cost.', HttpStatus.INTERNAL_SERVER_ERROR);
        }),
      ),
    );

    return {
      sedex: {
        codProductAgencia: data[0].codProdutoAgencia,
        price: data[0].precoPPN,
        deliveryTime: data[0].prazo,
        description: data[0].urlTitulo
      },
      pac: {
        codProductAgencia: data[1].codProdutoAgencia,
        price: data[1].precoPPN,
        deliveryTime: data[1].prazo,
        description: data[1].urlTitulo
      }
    };
  }
}

