const socket = io('/chattings'); // socket.io의 메소드를 사용하기 위한 준비이며,
// 네임스페이스는 '/chattings'가 된다.

const getElementById = (id) => {
  return document.getElementById(id) || null;
};
// DOM에서 특정 id를 가진 HTML 요소를 찾는다.
// id를 가진 HTML 요소가 존재하지 않는다면(undefined의 경우) null를 반환한다.

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

const helloUser = () => {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    console.log(data);
  });
  // emit은 '보내는 행위'
  // 서버에서 클라이언트로, 클라이언트에서 서버로 보낼 때도 emit
  // prompt를 통해 입력받은 내용을 변수 username에 할당하고,
  // 이벤트 'new_user'를 찾아간다. 여기서는 /src/chats/chats.gateway.ts이다.
  console.log(username);
  socket.on('hello_user', (data) => {
    console.log(data);
  });
  // on은 '받는 행위'
  // 서버가 보낸 데이터를 클라이언트가 받거나,
  // 클라이언트가 보낸 데이터를 서버가 받는 경우가 on
  // chats.gateway.ts의 'handleNewUser'메소드에서 socket.emit을 통해 보낸 데이터를 받아 이벤트를 수행한다.
};

const init = () => {
  helloUser();
};

init();
