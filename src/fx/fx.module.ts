import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { FxService } from 'src/fx/fx.service';
import { ConfigModule } from '@nestjs/config';
import { FXController } from './fx.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigModule])],
  controllers: [FXController],
  providers: [FxService],
})
export class FXModule {}
