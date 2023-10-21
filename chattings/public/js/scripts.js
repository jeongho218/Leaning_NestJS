const socket = io('/chattings'); // socket.io의 메소드를 사용하기 위한 준비이며,
// 네임스페이스는 '/chattings'가 된다.

const getElementById = (id) => {
  return document.getElementById(id) || null;
};

// get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// 전역 소켓 관리
// 신규 사용자 연결 알림
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected!`);
});
// 새로운 채팅 띄움
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username}: ${chat}`);
});
// 연결이 끊어진 사용자 알림
socket.on('disconnect_user', (username) => drawNewChat(`${username}: bye...`));

// 채팅창 입력 내용을 브로드캐스팅하는 함수
const handleSubmit = (event) => {
  event.preventDefault(); // 버튼을 클릭하였을때 페이지가 새로고침 하지 않음
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    // 화면에 그리기
    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

// 접속한 사용자의 이름을 웹 페이지에 띄워주는 함수
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);
// 사용자가 채팅박스에 입력한 내용을 웹 페이지에 띄워주는 함수
const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `<div>${message}</div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

// 접속한 사용자의 이름을 묻는 프롬프트를 띄우는 함수
const helloUser = () => {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
};

const init = () => {
  helloUser();
  formElement.addEventListener('submit', handleSubmit);
};

init();
