var Message = require("./core/message");
var BroadCastMessage = require("./core/broadcast.message");
var RegisterMessage = require("./core/register.message");
var Client = require("./core/client.socket");
var Server = require("./core/server.socket");
var AuthClient = require("./core/auth.client.socket");
var AuthServer = require("./core/auth.server.socket");

module.exports = {
    Client: Client,
    AuthClient: AuthClient,
    Server: Server,
    AuthServer: AuthServer,
    Message: Message,
    BroadCastMessage : BroadCastMessage,
    RegisterMessage : RegisterMessage
};
