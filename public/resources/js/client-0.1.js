class Client {
	constructor(socket,id,pos){
		this.socket = socket;
		this.id = id;
		this.pos = pos;
		this.name = undefined;
		this.icon = undefined;
	}

	display(){
		rect(this.pos.x, this.pos.y, 50, 50);
	}

	setName(name){
		this.name = name;
	}

	
};

module.exports = Client;