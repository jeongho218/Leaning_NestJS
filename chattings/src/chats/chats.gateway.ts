import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatsGateway {
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
