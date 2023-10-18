const socket = io('/'); // socket.io의 메소드
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
};

const init = () => {
  helloUser();
};

init();
