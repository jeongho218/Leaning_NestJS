const socket = io('/chattings'); // socket.io의 메소드를 사용하기 위한 준비이며,
// 네임스페이스는 '/chattings'가 된다.

const getElementById = (id) => {
  return document.getElementById(id) || null;
};

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//
socket.on('user_connected', (username) => {
  console.log(`${username} connected!`);
});

// 새로 접속한 사용자의 이름을 웹 페이지에 띄워주는 함수
const drawHelloStranger = (username) => {
  helloStrangerElement.innerText = `Hello ${username} Stranger :)`;
};

const helloUser = () => {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
};

const init = () => {
  helloUser();
};

init();
