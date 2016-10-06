var draw = {
	
	canv:false,
	ctx:false,
	
	setTarget:function(x) {
		this.canv = (typeof x === "string") ? document.getElementById(x) : x;
		
		try {
			this.ctx = this.canv.getContext("2d");
		} catch(e) {
			console.log("Could not set the context given: ", x);
		}
	},
	
	color:function(color) {
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
	},
	
	
	refresh:function() {
		this.ctx.clearRect(0, 0, this.canv.clientWidth, this.canv.clientHeight);
	},
	
	text:function(txt, x, y, size) {
		if (typeof size !== "number") { size = 30; }
		
		this.ctx.font = size + "px sans-serif";
		this.ctx.fillText(txt, x, y);
	},
	
	box:function(x0, y0, x1, y1) {
		this.ctx.beginPath();
		
		this.ctx.moveTo(x0, y0);
		this.ctx.lineTo(x1, y0);
		this.ctx.lineTo(x1, y1);
		this.ctx.lineTo(x0, y1);
				
		this.ctx.fill();
		this.ctx.closePath();
	},
	
	ball:function(x, y, radius) {
		this.ctx.beginPath();
		
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
		
		this.ctx.fill();
		this.ctx.closePath();
	},
	
	poly:function(coords) {
		var i;
		
		this.ctx.beginPath();
		this.ctx.moveTo(coords[0][0], coords[0][1]);
		for (i = 1; i < coords.length; i++) {
			this.lineTo(coords[i][0], coords[i][1]);
		}
		
		this.ctx.fill();
		this.ctx.closePath();
	}
}