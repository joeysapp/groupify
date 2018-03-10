class Client {
	constructor(id){
		this.id = id;
		this.username = undefined;
		this.icon = undefined;
		this.token = undefined
		this.token_refresh = undefined;
		this.status = "Init";

	}

	getUsername(){
		return this.username;
	}

	setUsertname(username){
		this.username = username;
	}


};

module.exports = Client;