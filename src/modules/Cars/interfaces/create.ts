import { ICars } from './main.interface';

export interface ICreateCarRequest {
  name: string;
  brand: string;
  year: number;
  price: number;

}

export interface ICreateCarRespnse {
  message: string;
  data: ICars[];
}
