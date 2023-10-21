import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('this is constructor');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // socket.id를 받고 해당하는 sockets.model에서
    // id === socket.id인 user를 가져와서 제거한다.
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.deleteOne();
    }
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
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // username을 db에 적재
    // username을 받고 해당하는 sockets.model에 username이 있는지 중복 체크
    // 중복이라면 랜덤한 숫자를 추가하여 username으로 저장하고 id에는 sockets.id를 저장한다.
    // 중복이 아니라면 그대로 username으로 저장하고 id에는 socket.id를 저장한다.
    const exist = await this.socketModel.exists({ username: username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketModel.create({
        id: socket.id,
        username: username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // socket.id를 받고 해당하는 sockets.model에서
    // id === socket.id인 user를 chattings.model에 해당하는 user와 chat을 저장한다.
    const socketObj = await this.socketModel.findOne({ id: socket.id });

    await this.chattingModel.create({
      user: socketObj,
      chat: chat,
    });

    socket.broadcast.emit('new_chat', { chat, username: socketObj.username });
  }
}
