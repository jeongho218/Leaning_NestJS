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
  // OnGateWayInit, OnGatewayConnection, OnGatewayDisconnect은 인터페이스이며 인터페이스는 규약이다.
  // 규약에 따라 OnGatewayInit의 뒤에는 반드시 afterInit()이 와야하며,
  // OnGatewayConnection의 뒤에는 반드시 handleConnection()이,
  // OnGatewayDisconnect의 뒤에는 반드시 handleDisconnect()가 와야한다.
  // https://docs.nestjs.com/websockets/gateways#lifecycle-hooks
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
  // 인터페이스에 따라온 함수의 실행 순서는 constructor, afterInit, handleConnection이며
  // handleConnection은 socket이 연결된 후 실행된다.

  @SubscribeMessage('new_user')
  // /public/script.js의 함수 helloUser에서 socket.emit 메소드로 보낸 데이터를 받는다.
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id); // 소켓의 아이디
    // 모든 소켓은 개별적인 아이디를 가지며, 연결이 끊어질때마다 이 아이디는 사라진다. 새로 연결하면 새로운 아이디를 받는다.
    console.log(username);
    socket.emit('hello_user', 'Hello ' + username);
    // 다시 emit으로 'hello_user'이벤트를 향해 보내거나
    return 'this is return for emit!';
    // return을 통해 값을 반환할 수도 있다.
  }
}
