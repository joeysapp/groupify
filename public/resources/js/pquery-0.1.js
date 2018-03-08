var instances = [];
var socket;

var sketch = function(p){
	var canvas;

	p.setup = function(){
		this.canvas = p.createCanvas(p.windowWidth, p.windowHeight*(1-0.14));
		this.canvas.parent('view');
		console.log("Connecting to room with "+Object.keys(clients).length+" other users.");
	}

	p.draw = function(){
		p.ellipse(p.windowWidth/2, p.windowHeight/2, 18, 18);
		p.stroke(255,0,0);
		p.noFill();
		p.strokeWeight(3);
		// p.fill(255, 0, 0);
		for (var key in clients){
			// console.log(clients[key]);
		}


	}

	p.windowResized = function(){
		p.size(windowWidth, p.windowHeight*(1-0.14));

	}


}


var gamewindow = new p5(sketch);