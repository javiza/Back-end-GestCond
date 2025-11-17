import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class KeepAliveService {

  @Cron('*/4 * * * *') // cada 4 minutos
  ping() {
    console.log('KeepAlive: ping interno para evitar suspensión Render');
  }

}
