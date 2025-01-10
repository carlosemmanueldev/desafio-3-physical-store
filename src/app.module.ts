import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GoogleMapsService } from './google-maps/google-maps.service';
import { GoogleMapsModule } from './google-maps/google-maps.module';
import { ViaCepModule } from './via-cep/via-cep.module';
import { CorreiosModule } from './correios/correios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE'),
      }),
    }),
    StoresModule,
    GoogleMapsModule,
    ViaCepModule,
    CorreiosModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    GoogleMapsService
  ],
})
export class AppModule {}
