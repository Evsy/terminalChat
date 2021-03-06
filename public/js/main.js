const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
//Get username and room from URL

const {username, room} = Qs.parse(location.search, {     
    ignoreQueryPrefix: true
});
console.log(username, room);

const socket = io();


//join chatroom
socket.emit('joinRoom', {username, room})

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
});

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message); 

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submitting message

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Get message text
    const msg = e.target.elements.msg.value;
    //Emit message to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//output message to DOM

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//adding room name

function outputRoomName(room) {
    roomName.innerText = room;
}