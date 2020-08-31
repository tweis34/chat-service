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

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    //should probably have a guard for this?
    const payLoad = JSON.stringify(payload);
    const pl = JSON.parse(payLoad);
    this.logger.log(`message ${payLoad}`);
    this.logger.log(`message ${pl.clientUniqueId}`);
    this.server.to(pl.chatRoom).emit('msgToClient', payload);

  }
 
  afterInit(server: Server) {
    this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  //eventually have this emit when a user joins the chat
  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string){
    client.join(room);
    client.emit('joinedRoom', room);
  }
  
}
