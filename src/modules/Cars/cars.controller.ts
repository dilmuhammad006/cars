import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import {
  ICreateCarRespnse,
  IDeleteCarsRequest,
  IDeleteCarsResponse,
  IGetAllRequest,
  IGetAllResponse,
  IUpdateCarsResponse,
} from './interfaces';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Createdto } from './dtos';
import { UpdateDto } from './dtos/update';
import { CheckFilesize, CheckMimeTypes } from 'src/pipes';
@Controller('cars')
export class CarsController {
  constructor(private readonly service: CarsService) {}

  @Get()
  async Getall(payload: IGetAllRequest): Promise<IGetAllResponse> {
    return await this.service.GetAll(payload);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async Create(
    @Body() body: Createdto,
    @UploadedFiles(
      new CheckFilesize(10 * 1024 * 1024),
      new CheckMimeTypes(['jpeg', 'mpeg', 'png', 'jpg']),
    )
    images: Express.Multer.File[],
  ): Promise<ICreateCarRespnse> {
    return await this.service.Create({ ...body }, images);
  }

  @Delete(':id')
  async Delete(
    @Param() param: IDeleteCarsRequest,
  ): Promise<IDeleteCarsResponse> {
    return await this.service.Delete(param);
  }
  @Delete('image/:id')
  async DeleteImage(
    @Param() param: IDeleteCarsRequest,
  ): Promise<IDeleteCarsResponse> {
    return await this.service.DeleteImage(param);
  }

  @Patch(':id')
  async Update(
    @Body() body: UpdateDto,
    @Param('id') id: string,
  ): Promise<IUpdateCarsResponse> {
    return await this.service.Update({ ...body }, Number(id));
  }

  @Patch('image/:id')
  @UseInterceptors(FileInterceptor('image'))
  async UpdateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.service.UpdateImage(image, id);
  }
}
