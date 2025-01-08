import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { ViaCepResponse } from './interfaces/via-cep.interface';

@Injectable()
export class ViaCepService {
  constructor(private httpService: HttpService) {}

  async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    const { data }: AxiosResponse<ViaCepResponse> = await firstValueFrom(this.httpService.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException('Invalid postal code format. Please check the postal code provided.', HttpStatus.BAD_REQUEST);
        }),
      ),
    );

    if (data.erro) {
      throw new HttpException('Postal code not found.', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}