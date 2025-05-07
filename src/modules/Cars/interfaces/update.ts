import { ICars } from './main.interface';

export interface IUpdateCarsRequest {
  name?: string;
  brand?: string;
  year?: number;
  price?: number;
}

export interface IUpdateCarsResponse {
  message: string;
  data: ICars[];
}
