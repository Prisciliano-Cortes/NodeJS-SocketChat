const { io } = require('../server');
const { Users } = require('../classes/user');
const { createMessage } = require('../utils/utils')

const users = new Users();

io.on('connection', (client) => {
    client.on('goChat', (data, callback) => {
        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name and room is required'
            })
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('listPerson', users.getPersonRoom(data.room))

        callback(users.getPersonRoom(data.room))
    })

    client.on('createMessage', (data, callback) => {
        let person = users.getAllPerson(client.id);
        let message = createMessage(person, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);

        callback(message)
    })

    client.on('disconnect', () => {
        let personDelete = users.deletePerson(client.id);

        // client.broadcast.emit('createMessage', { user: 'Administrator', message:`${personDelete.name} left the chat` })
        client.broadcast.to(personDelete.room).emit('createMessage', createMessage('Administrator', `${personDelete.name} left the chat`))
        client.broadcast.to(personDelete.room).emit('listPerson', users.getPersonRoom(personDelete.room))
    })

    //*** Private message */
    client.on('messagePrivate', (data) => {
        let person = user.getAllPerson(client.id);
        client.broadcast.to(data.from).emit('messagePrivate', createMessage(person.name, data.message))
    })
});