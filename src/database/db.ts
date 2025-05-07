import { BadRequestException, Injectable } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class PostgresService {
  private readonly pool: Pool;
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async query(queryStr: string, params: any[] = []) {
    try {
      const { rows } = await this.pool.query(queryStr, params);
      return rows;
    } catch (error) {
      console.log(error?.message);
      throw new BadRequestException('❌');
    }
  }
}
