import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',  // Render permite esto
  },
})
export class RegistrosGateway {
  @WebSocketServer()
  server: Server;

  emitirNuevoRegistro(data: any) {
    this.server.emit('actualizarRegistros', data);
  }
}
