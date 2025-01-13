import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post, Query,
} from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { StoresService } from './stores.service';
import { Store } from './schemas/store.schema';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { StoresDto } from './dtos/stores.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StoreResponseDto } from './dtos/store-response.dto';
import { StoresWithPinsDto } from './dtos/stores-with-pins.dto';
import { StoreResponse } from './interfaces/store-response.interface';
import { StoresResponse } from './interfaces/stores-response.interface';
import { StoresCep } from './interfaces/stores-cep.interface';

@Controller('stores')
@ApiTags('stores')
export class StoresController {
  constructor(private StoresService: StoresService) {}

  @Post('/')
  @Serialize(StoreResponseDto)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a store', description: 'Create a store with the given information.' })
  @ApiCreatedResponse({ description: 'The created store', type: StoreResponseDto })
  async createStore(@Body() body: CreateStoreDto): Promise<StoreResponse>{
    const store: Store = await this.StoresService.create(body);

    return { status: 'success', store };
  }

  @Patch('/:id')
  @Serialize(StoreResponseDto)
  @ApiOperation({ summary: 'Update a store', description: 'Update a store by the given ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the store you want to delete', example: '63d9f9f9f9f9f9f9f9f9f9f9' })
  @ApiOkResponse({ description: 'The updated store', type: StoreResponseDto })
  async updateStore(@Param('id') id: string, @Body() body: UpdateStoreDto): Promise<StoreResponse> {
    const store: Store = await this.StoresService.update(id, body);

    return { status: 'success', store };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a store', description: 'Delete a store by the given ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the store you want to delete', example: '63d9f9f9f9f9f9f9f9f9f9f9' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The store was successfully deleted.'})
  async deleteStore(@Param('id') id: string): Promise<void> {
    await this.StoresService.delete(id);
  }

  @Get('/:id')
  @Serialize(StoreResponseDto)
  @ApiOperation({ summary: 'Get the store of the given ID', description: 'Get all the informations of the store with the given ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the store you want to return', example: '51020900' })
  @ApiOkResponse({ description: 'The list of stores by CEP', type: StoreResponseDto })
  async getStoreById(@Param('id') id: string): Promise<StoreResponse> {
    const store: Store = await this.StoresService.getById(id);

    return { status: 'success', store };
  }

  @Get('/')
  @Serialize(StoresDto)
  @ApiOperation({ summary: 'Get all stores', description: 'Get a list of all the stores with pagination.' })
  @ApiQuery({ name: 'limit', required: false, description: 'The amount of results you want per page', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'The page you want to retrieve', example: 1 })
  @ApiOkResponse({ description: 'The list of stores by CEP', type: StoresDto })
  async listAll(@Query('limit') limitReq?: number, @Query('offset') offsetReq?: number): Promise<StoresResponse> {
    const { stores, totalStores, totalPages, offset, limit } = await this.StoresService.getAll(offsetReq, limitReq);

    return { status: 'success', stores, totalStores, totalPages, offset, limit };
  }

  @Get('/by-cep/:cep')
  @Serialize(StoresWithPinsDto)
  @ApiOperation({ summary: 'Get stores near by CEP', description: 'Get a list of stores near by CEP with pagination.' })
  @ApiParam({ name: 'cep', description: 'The CEP to search for stores', example: '51020-900' })
  @ApiQuery({ name: 'limit', required: false, description: 'The amount of results you want per page', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'The page you want to retrieve', example: 1 })
  @ApiOkResponse({ description: 'The list of stores by CEP', type: StoresWithPinsDto })
  async getStoresByCep(@Param('cep') cep: string, @Query('limit') limitReq: number, @Query('offset') offsetReq: number): Promise<StoresCep> {
    const { stores, pins, totalStores, totalPages, offset, limit } = await this.StoresService.getNearBy(cep, offsetReq, limitReq);

    return { status: 'success', stores, pins, totalStores, totalPages, offset, limit };
  }

  @Get('/by-state/:state')
  @Serialize(StoresDto)
  @ApiOperation({ summary: 'Get stores by state', description: 'Get a list of stores by state with pagination.' })
  @ApiParam({ name: 'state', description: 'The state abbreviation', example: 'PE' })
  @ApiQuery({ name: 'limit', required: false, description: 'The amount of results you want per page', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'The page you want to retrieve', example: 1 })
  @ApiOkResponse({ description: 'The list of stores by state', type: StoresDto })
  async getStoresByState(@Param('state') state: string, @Query('limit') limitReq?: number, @Query('offset') offsetReq?: number): Promise<StoresResponse> {
    const { stores, totalStores, totalPages, offset, limit } = await this.StoresService.getByState(state, offsetReq, limitReq);

    return { status: 'success', stores, totalStores, totalPages, offset, limit };
  }
}