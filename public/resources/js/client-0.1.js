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
};

module.exports = Client;