import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  constructor() {
    this.logger.log('this is constructor');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}, ${socket.nsp.name}`); // nsp는 네임스페이스의 약자
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log('this is connect');
    this.logger.log(`connected: ${socket.id}, ${socket.nsp.name}`);
  }

  afterInit() {
    this.logger.log('this is init');
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // username을 db에 적재
    // 접속해 있는 모든 사용자에게 새로운 사용자의 username을 전달( broadcast)
    // 그냥 socket.emit을 사용하면 해당 소켓 아이디를 가진 대상에만 데이터를 보내지만,
    // broadcast를 사용하여 현재 서버와 연결 중인 모든 소켓에 데이터를 보낼 수 있다.
    socket.broadcast.emit('user_connected', username);
    return username;
  }
}
