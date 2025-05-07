import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './modules';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CarsModule],
})

export class AppModule {}
