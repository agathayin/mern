'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Send a chat messages to all connected sockets when a message is received
  socket.on('workOrderMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.emit('workOrderMessage', message);
  });
};
