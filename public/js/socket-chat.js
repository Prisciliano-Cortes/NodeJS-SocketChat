const socket = io();

const params = new URLSearchParams(window.location.search)

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('name and room is required');
}

const user = {
    name: params.get('name'),
    room: params.get('room')
}

//*** Connect chat */
socket.on('connect', function() {
    console.log('Connect to server');

    socket.emit('goChat', user, (res) => {
        console.log('res', res)
        renderUsers(res)
    })
});

//*** Disconnect chat */
socket.on('disconnect', function() {
    console.log('We lost connection to the server');
});


//*** Send data */
// socket.emit('sendMessage', {
//     user: 'Fernando',
//     message: 'Hello world'
// }, function(resp) {
//     console.log('response server: ', resp);
// });

//*** Listen data */
socket.on('createMessage', function(message) {
    //console.log('Server:', message);
    renderMessages(message)
});

//*** Listen change user in chat */
socket.on('listPerson', function(persons) {
    console.log('Server:', persons);
    renderUsers(persons)
});

//*** Private messages */
socket.on('messagePrivate', function(message) {
    console.log('private message', message)
})