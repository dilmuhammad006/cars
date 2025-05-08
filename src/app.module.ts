import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    CarsModule,
  ],
})
export class AppModule {}
