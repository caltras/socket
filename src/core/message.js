class Message{
    
    constructor(message,type){
        this.type = type;
        this.broadcast = (this.type === Message.BROADCAST);
        this.message =message;
    }
    toString(){
        return JSON.stringify(this);
    }
}

Message.build = function(str){
    let msg = str.toString('utf-8');
    try{
        let obj = JSON.parse(msg);
        var m = new Message(obj.message,obj.type);
        m.to = obj.to;
        m.from=obj.from;
        return m;
    }catch(e){
        return new Message(msg);
    }
};

Message.BROADCAST = "BROADCAST";
Message.EMIT = "EMIT";
Message.REGISTER = "REGISTER";

module.exports = Message;