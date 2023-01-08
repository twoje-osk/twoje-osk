import { Module } from '@nestjs/common';
import { CepikService } from './cepik.service';

@Module({
  providers: [CepikService],
  exports: [CepikService],
})
export class CepikModule {}
