import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CorreiosService],
  exports: [CorreiosService]
})
export class CorreiosModule {}
