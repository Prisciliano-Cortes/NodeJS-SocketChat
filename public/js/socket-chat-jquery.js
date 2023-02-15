const parameters = new URLSearchParams(window.location.search);
const nameUser = parameters.get('name');
const roomUser = parameters.get('room')

//*** References for JQuery */
const divUser = $('#divUsers');
const formSend = $("#formSend");
const txtMessage = $("#txtMessage");
const divChatBox = $('#divChatBox');

//*** functions for users */
function renderUsers(persons) {
    let html = '';

    html += '<li>'
    html +=    '<a href="javascript:void(0)" class="active"> Chat de <span>'+ parameters.get('room') +'</span></a>'
    html += '</li>';

    for (let i = 0; i < persons.length; i++) {
        html += '<li>'
        html +=    '<a data-id="'+ persons[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ persons[i].name +'<small class="text-success">online</small></span></a>'
        html += '</li>'      
    }

    divUser.html(html);
}

function renderMessages( message ) {
    let html = '';

    console.log("Message", message)
    html += '<li class="animated fadeIn">'
    html +=    '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    html +=         '<div class="chat-content">';
    html +=             '<h5>' + message.name + '</h5>';
    html +=             '<div class="box bg-light-info">' + message.message + '</div>';
    html +=         '</div>';
    html +=    '<div class="chat-time">10:56 am</div>';
    html += '</li>';

    divChatBox.append(html)
}

//*** Listeners */

divUser.on('click', 'a', function(){
    const id = $(this).data('id');

    if (id) {
        console.log(id)
    }
})

formSend.on('submit', function(e) {
    e.preventDefault();

    if (txtMessage.val().trim().length === 0) {
        return
    }

    //*** Send data */
    socket.emit('createMessage', {
        user: nameUser,
        message: txtMessage.val(),
    }, function(message) {
        txtMessage.val('').focus()
        renderMessages(message)
    });
})