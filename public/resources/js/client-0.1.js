class Client {
	constructor(id){
		this.id = id;
		this.name = undefined;
		this.icon = undefined;
		this.token = undefined
		this.token_refresh = undefined;

	}

	getName(){
		return this.name;
	}

	setName(name){
		this.name = name;
	}


};

module.exports = Client;