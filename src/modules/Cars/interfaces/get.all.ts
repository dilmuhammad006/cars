import { ICars } from './main.interface';

export interface IGetAllRequest {
  page: number;
  limit: number;
}

export interface IGetAllResponse {
  message: string;
  count: number;
  data: ICars[];
}
