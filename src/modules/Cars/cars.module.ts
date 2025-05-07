import { Module } from '@nestjs/common';
import { PostgresService } from 'src/database';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { fsHelper } from 'src/helpers';

@Module({
  controllers: [CarsController],
  providers: [CarsService, PostgresService, fsHelper],
})
export class CarsModule {}
