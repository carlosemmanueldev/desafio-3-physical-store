import { Module } from '@nestjs/common';
import { ViaCepService } from './via-cep.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ViaCepService],
  exports: [ViaCepService],
})
export class ViaCepModule {}
