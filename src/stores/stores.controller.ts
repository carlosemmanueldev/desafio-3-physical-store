import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post, Query,
} from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoresService } from './stores.service';
import { Store } from './store.schema';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { StoreDto, StoreResponseDto } from './dtos/store.dto';
import { MultipleStoresDto } from './dtos/multiple-stores.dto';
import { MultipleStoreWithPinsResponseDto } from './dtos/stores-with-pins.dto';

@Controller('stores')
export class StoresController {
  constructor(private StoresService: StoresService) {
  }

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
  @Serialize(MultipleStoresDto)
  async listAll(@Query('limit') limitReq: number, @Query('offset') offsetReq: number) {
    const { stores, totalStores, totalPages, offset, limit } = await this.StoresService.getAll(+offsetReq, +limitReq);

    return { status: 'success', stores, totalStores, totalPages, offset, limit };
  }

  @Get('/by-cep/:cep')
  @Serialize(MultipleStoreWithPinsResponseDto)
  async getStoresByCep(@Param('cep') cep: string, @Query('limit') limitReq: number, @Query('offset') offsetReq: number) {
    const { stores, pins, totalStores, totalPages, offset, limit } = await this.StoresService.getNearBy(cep, +offsetReq, +limitReq);

    return { status: 'success', stores, pins, totalStores, totalPages, offset, limit };
  }

  @Get('/by-state/:state')
  @Serialize(MultipleStoresDto)
  async getStoresByState(@Param('state') state: string, @Query('limit') limitReq: number, @Query('offset') offsetReq: number) {
    const { stores, totalStores, totalPages, offset, limit } = await this.StoresService.getByState(state, +offsetReq, +limitReq);

    return { status: 'success', stores, totalStores, totalPages, offset, limit };
  }
}