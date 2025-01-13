import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schemas/store.schema';
import { ViaCepModule } from '../via-cep/via-cep.module';
import { GoogleMapsModule } from '../google-maps/google-maps.module';
import { CorreiosModule } from '../correios/correios.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Store.name,
        schema: StoreSchema,
      },
    ]),
    ViaCepModule,
    GoogleMapsModule,
    CorreiosModule,
  ],
  controllers: [StoresController],
  providers: [StoresService]
})
export class StoresModule {}
