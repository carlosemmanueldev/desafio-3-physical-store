import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoresService } from './stores.service';
import { Store } from './store.schema';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { StoreDto, StoreResponseDto } from './dtos/store.dto';
import { MultipleStoresDto } from './dtos/multiple-stores.dto';
import { MultipleStoreWithPinsResponseDto } from './dtos/pins.dto';

@Controller('stores')
export class StoresController {
  constructor(private StoresService: StoresService) {}

  @Post('/')
  @Serialize(StoreResponseDto)
  async createStore(@Body() body: CreateStoreDto) {
    const store = await this.StoresService.create(body);
    return { status: 'success', store };
  }

  @Patch('/:id')
  @Serialize(StoreResponseDto)
  async updateStore(@Param('id') id: string, @Body() body: UpdateStoreDto) {
    const store = await this.StoresService.update(id, body);
    return { status: 'success', store };
  }

  @Delete('/:id')
  deleteStore(@Param('id') id: string): Promise<Store> {
    return this.StoresService.delete(id);
  }

  @Get('/:id')
  @Serialize(StoreResponseDto)
  async getStoreById(@Param('id') id: string) {
    const store: Store = await this.StoresService.getById(id);
    return { status: 'success', store };
  }

  @Get('/')
  @Serialize(StoreDto)
  listAll() {
    return this.StoresService.getAll();
  }

  @Get('/by-cep/:cep')
  @Serialize(MultipleStoreWithPinsResponseDto)
  getStoresByCep(@Param('cep') cep: string) {
    return this.StoresService.getNearBy(cep);
  }

  @Get('/by-state/:state')
  @Serialize(MultipleStoresDto)
  async getStoresByState(@Param('state') state: string, @Param('limit') limit: number, @Param('offset') offset: number) {
    const stores = await this.StoresService.getByState(state, limit, offset);
    return { status: 'success', stores};
  }
}