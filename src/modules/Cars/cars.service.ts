import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PostgresService } from 'src/database';
import { CarsImagesModelTable, CarsModelTable } from './models';
import { Createdto, UpdateDto } from './dtos';
import {
  ICreateCarRespnse,
  IDeleteCarsRequest,
  IDeleteCarsResponse,
  IGetAllRequest,
  IGetAllResponse,
  IUpdateCarsResponse,
} from './interfaces';
import { fsHelper } from 'src/helpers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CarsService implements OnModuleInit {
  constructor(
    private readonly pg: PostgresService,
    private readonly fs: fsHelper,
  ) {}
  async onModuleInit() {
    try {
      await this.pg.query(CarsModelTable);
      await this.pg.query(CarsImagesModelTable);
      console.log('✅');
    } catch (error) {
      console.log('❌');
    }
  }

  async GetAll(payload: IGetAllRequest): Promise<IGetAllResponse> {
    const cars = await this.pg.query(
      `SELECT 
         c.id, 
         c.name,  
         c.brand, 
         c.year, 
         c.price, 
         json_agg(json_build_object('id', i.id, 'images', i.images)) AS images
       FROM cars c
       LEFT JOIN images i 
         ON c.id = i.car_id
       GROUP BY c.id, c.name, c.brand, c.year, c.price`,
    );

    return {
      message: 'succes',
      count: cars.length,
      data: cars,
    };
  }

  async Create(
    payload: Createdto,
    images: Express.Multer.File[],
  ): Promise<ICreateCarRespnse> {
    const [founded] = await this.pg.query(
      'SELECT * FROM cars WHERE name = $1 AND brand = $2',
      [payload.name, payload.brand],
    );

    if (founded) {
      throw new ConflictException(
        'This car with this model is already exists!',
      );
    }

    const Newcar = await this.pg.query(
      'INSERT INTO cars (name, brand, year, price) VALUES($1, $2, $3, $4) RETURNING *',
      [payload.name, payload.brand, payload.year, payload.price],
    );

    const id = Newcar[0].id;

    for (let image of images) {
      const { fileUrl } = await this.fs.uploadFile(image);
      await this.pg.query(
        'INSERT INTO images (images, car_id) VALUES($1, $2) RETURNING * ',
        [fileUrl, id],
      );
    }

    const cars = await this.pg.query(
      `
      SELECT 
        c.id, c.name, c.brand, c.year, c.price,
        json_agg(i.images) AS images
      FROM cars c
      LEFT JOIN images i ON c.id = i.car_id
      GROUP BY c.id, c.name, c.brand, c.year, c.price
      `,
    );

    return {
      message: 'succes',
      data: cars,
    };
  }

  async Delete(payload: IDeleteCarsRequest): Promise<IDeleteCarsResponse> {
    const [founded] = await this.pg.query('SELECT * FROM cars WHERE id = $1', [
      payload.id,
    ]);
    const foundedImages = await this.pg.query(
      'SELECT * FROM images WHERE car_id = $1',
      [payload.id],
    );
    if (!founded) {
      throw new NotFoundException('Car not found with given ID');
    }

    for (let image of foundedImages) {
      if (fs.existsSync(path.join(process.cwd(), 'uploads', image.images))) {
        await this.fs.unlinkFile(image.images);
      }
    }

    await this.pg.query('DELETE FROM cars WHERE id = $1', [payload.id]);
    await this.pg.query('DELETE FROM images WHERE car_id = $1', [payload.id]);

    return {
      message: 'succes',
    };
  }

  async DeleteImage(payload: IDeleteCarsRequest): Promise<IDeleteCarsResponse> {
    const [founded] = await this.pg.query(
      'SELECT * FROM images WHERE id = $1',
      [payload.id],
    );

    if (!founded) {
      throw new NotFoundException('Image not found with given id!');
    }
    await this.fs.unlinkFile(founded.images);
    await this.pg.query('DELETE FROM images WHERE id = $1', [payload.id]);

    return {
      message: 'succes',
    };
  }

  async Update(payload: UpdateDto, id: number): Promise<IUpdateCarsResponse> {
    const [founded] = await this.pg.query('SELECT * FROM cars WHERE id = $1', [
      id,
    ]);

    if (!founded) {
      throw new NotFoundException('Car not found with given id');
    }

    const cars = await this.pg.query(
      `UPDATE cars
       SET name = COALESCE($1, name),
           brand = COALESCE($2, brand),
           year = COALESCE($3, year),
           price = COALESCE($4, price)
       WHERE id = $5
       RETURNING *`,
      [payload.name, payload.brand, payload.year, payload.price, id],
    );

    return {
      message: 'succes',
      data: cars,
    };
  }

  async UpdateImage(file: Express.Multer.File, id: number) {
    const [founded] = await this.pg.query(
      'SELECT * FROM images WHERE id = $1',
      [id],
    );

    if (!founded) {
      throw new NotFoundException('Image not found with given id!');
    }

    await this.fs.unlinkFile(founded.images);
    const image = await this.fs.uploadFile(file);

    const images = await this.pg.query(
      'UPDATE images SET images = $1 WHERE id = $2 RETURNING *',
      [image.fileUrl, id],
    );

    return {
      message: 'succes',
      data: images,
    };
  }
}
