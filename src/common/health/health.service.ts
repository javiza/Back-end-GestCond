
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (err) {
      console.error('Error comprobando conexión a PostgreSQL:', err);
      return false;
    }
  }

  async getHealthStatus() {
    const db = await this.checkDatabase();

    return {
      status: db ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: db ? 'connected' : 'disconnected',
    };
  }
}
