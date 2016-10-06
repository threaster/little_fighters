// Manages dependences, screen sizing, and intialization
(function() {
	
	var reqs,
	    aspectRatio,
	    dependencies;
	
	aspectRatio = 16/9;
	
	reqs = [];
	reqs.push("math.js");
	reqs.push("draw.js");
	require(reqs);
	
	function require(reqs) {
		var i,
		    elem;
		
		dependencies = [];
		for (i = 0; i < reqs.length; i++) {
			
			elem = document.createElement("script");
			elem.type = "text/javascript";
			elem.src = reqs[i] + "?" + Date.now();
			dependencies.push({
				src:elem.src,
				loaded:false
			});
			elem.onload = function() { markLoaded(this.src); }
			
			document.head.appendChild(elem);
		}
	}
	
	function markLoaded(src) {
		var i;
		
		for (i in dependencies) {
			if (dependencies[i].src === src) {
				dependencies[i].loaded = true;
			}
		}
	}
	
	function positionCanvas(elem) {
		
		if (window.innerWidth > window.innerHeight * aspectRatio) {
			
			elem.height = window.innerHeight;
			elem.width = window.innerHeight * aspectRatio;
			elem.style.top = 0;
			elem.style.left = ((window.innerWidth - elem.width) / 2) + "px";
			
			return;
		}
		
		elem.width = window.innerWidth;
		elem.height = window.innerWidth / aspectRatio;
		elem.style.left = 0;
		elem.style.top = ((window.innerHeight - elem.height) / 2) + "px";
	}
	
	
	function init() {
		var i;
		
		for (i in dependencies) {
			if (dependencies[i].loaded === false) {
				setTimeout(init, 100);
				return;
			}
		}
		
		initCanvas();
		
		require(["script.js"]);
	}
	
	function initCanvas() {
		var canv;
		
		canv = document.createElement("canvas");
		document.body.appendChild(canv);
		positionCanvas(canv);
		
		window.addEventListener("resize", function() { positionCanvas(canv); });
		
		draw.setTarget(canv);
	}
	
	window.addEventListener("DOMContentLoaded", init);
	
	
	
})();