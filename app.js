var express = require('express');
var app = express();
// var http = require('http').Server(app);
var io = require('socket.io')(); //(http)

const port = process.env.PORT || 3000;

//tell express where our static files are (js, images, css, etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

io.attach(server);

io.on('connection', function(socket){
    console.log('a user has connected');

    socket.emit('connected', { sID: `${socket.id}`, message: "new connection"});

    
//connect message 
    socket.on('connect message', function(msg) {
        //send the message to everyone connected to the app when someone connects
        io.emit('connect message', {id: `${socket.id}`, message: msg});
    })


    
//chat message
    socket.on('chat message', function(msg) {
        console.log('message: ', msg, 'socket:', socket.id);

        //send the message to everyone connected to the app
        io.emit('chat message', {id: `${socket.id}`, message: msg});
    })

    socket.on('disconnect', function(msg){
        console.log('a user has disconnected');
        io.emit('disconnect message', {id: `${socket.id}`, message: msg});
      
    });
})