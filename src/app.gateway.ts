import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
 import { Logger } from '@nestjs/common';
 import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayDisconnect {
//, OnGatewayConnection
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    /* this.logger.log(`message ${payload}`);
    this.server.emit('msgToClient', payload); */


    const payLoad = JSON.stringify(payload);
    const pl = JSON.parse(payLoad);
    this.logger.log(`message ${payLoad}`);
    this.logger.log(`message ${pl.clientUniqueId}`);
    this.server.to(pl.clientUniqueId).emit('msgToClient', payload);
  }
 
  afterInit(server: Server) {
    this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
 
  /* handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  } */

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string){
    client.join(room);
    client.emit('joinedRoom', room);
  }
  
}
