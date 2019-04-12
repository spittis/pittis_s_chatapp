import ChatMessage from './modules/ChatMessage.js';

const socket = io();

function logConnect({sID, message}){ 
    console.log(sID, message);
    vm.socketID = sID;

    var newUser = new Object();
        socket.emit('connect message', { content: "A new user has entered the chat", object: newUser});
}

function appendMessage(message){
    vm.messages.push(message);
    var byeUser = new Object();
        socket.emit('disconnect message', { content: "A user has exited the chat", object: byeUser});
}


//create vue instance
const vm = new Vue ({
    data : {
        socketID: "",
        nickname: "",
        message: "",
        messages: []
    },

    methods: {
        dispatchMessage(){
            //emit message event from the client side
            socket.emit('chat message', {content: this.message, name: this.nickname || "Anonymous"});

            //reset the message
            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount(`#app`);

socket.on('connected', logConnect);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('connect message', appendMessage);
socket.addEventListener('disconnect', appendMessage);
