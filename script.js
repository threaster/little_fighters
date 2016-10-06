(function() {
	
	var c,
	    movingObjects,
	    map,
	    screen,
	    keys,
	    els,
	    t,
	    ratio,
	    frameCount,
	    frameRate,
	    imgs,
	    p;
	
	t = Date.now();
	frameCount = 0;
	frameRate = 0;
	
	imgs = {
		p:{
			s:"armored-right-alt.png",
			m1:"armored-right-m1-alt.png",
			m2:"armored-right-m2-alt.png",
		},
		w:{
			ls:"longsword.png"
		}
	}
	c = [];
	keys = {
		left:{
			key:"a",
			pressed:false
		},
		down:{
			key:"s",
			pressed:false
		},
		right:{
			key:"d",
			pressed:false
		},
		up:{
			key:"w",
			pressed:false
		},
		attack:{
			key:"j",
			pressed:false
		},
		block:{
			key:"k",
			pressed:false
		},
		jump:{
			key:"l",
			pressed:false
		},
		meta:{
			key:"Meta",
			pressed:false
		},
		fullscreen:{
			key:"g",
			pressed:false
		}
	};
	els = [];
	map = {
		bound:{},
		offset:50
	};
	screen = {};
	movingObjects = [];
	
	// =================================================
	// "Classes"
	// =================================================
	function Object(name) {
		this.name = (typeof name === "string") ? name : "Rando";
		this.health = 100;
		
		// Game position
		this.pos = {
			x:false,
			y:false,
			z:false
		}
		
		// Velocity
		this.vel = {
			x:0,
			y:0,
			z:0
		}
		
		// Hitbox
		this.dim = {
			x:40,
			y:40,
			z:20
		}
		
		this.isInControl = false;
		this.isInFreefall = false;
		this.movingSince = false;
		this.orientation = "left",
		
		this.setPosition = function(val) {
			
			this.setPosX(val.x);
			this.setPosY(val.y);
			this.setPosZ(val.z);
			
			return this;
		}
		this.setPosX = function(val) {
			if (val < 0) { val = 0; }
			this.pos.x = val;
			return this;
		}
		this.setPosY = function(val) {
			if (val < 0) { val = 0; }
			if (val === 0) { this.isInFreefall = false; }
			this.pos.y = val;
			return this;
		}
		this.setPosZ = function(val) {
			if (val < 0) { val = 0; }
			if (val > (screen.height - map.bound.top)/ratio) {
				val = (screen.height - map.bound.top)/ratio;
			}
			this.pos.z = val;
			return this;
		}
		
		this.moveRight = function() {
			if (this.isInFreefall === false && this.isInControl === true) {
				this.vel.x = this.moveSpeed;
				this.orientation = "right";
				if (this.movingSince === false) { this.movingSince = Date.now(); }
			} 
		}
		this.moveLeft = function() {
			if (this.isInFreefall === false && this.isInControl === true) {
				this.vel.x = -1 * this.moveSpeed; 
				this.orientation = "left";
				if (this.movingSince === false) { this.movingSince = Date.now(); }
			}
		}
		this.moveUp = function() {
			if (this.isInFreefall === false && this.isInControl === true) {
				this.vel.z = this.moveSpeed;
				if (this.movingSince === false) { this.movingSince = Date.now(); }
			} 
		}
		this.moveDown = function() {
			if (this.isInFreefall === false && this.isInControl === true) {
				this.vel.z = -1 * this.moveSpeed;
				if (this.movingSince === false) { this.movingSince = Date.now(); }
			} 
		}
		
		this.jump = function() {
			if (this.isInFreefall === false) {
				this.isInFreefall = true;
				this.vel.y = p.getJumpHeight();
			}
		}
		
		this.stopMovingX = function() {
			if (this.isInControl === true && this.isInFreefall === false) {
				this.vel.x = 0;
			}
		}
		this.stopMovingZ = function() {
			if (this.isInControl === true && this.isInFreefall === false) {
				this.vel.z = 0;
			}
		}
		
		this.attack = function() {
			if (this.attacking === false) {
				this.attacking = true;
				setTimeout(this.finishAttack.bind(this), this.attackSpeed * 1000);
			}
		}
		this.finishAttack = function() {
			this.attacking = false;
			alert(this.name);
		}
	}
	
	function Character(name) {
		Object.call(this, name);
		
		this.type = "Character";
		this.isInControl = true;
		this.state = false;
		
		// Mvmt
		this.moveSpeed = 4;
		this.jumpHeight = 8;
		
		// Dmg
		this.attacking = false;
		this.attackSpeed = 1;
		this.dmgMultiplier = 1;
		this.baseDamage = 10;
		
		// Stats
		this.health = 100;
		this.mana = 100;
		this.stamina = 100;
		
		// Hitbox
		this.dim.y = 100;
		
		
		this.getMoveSpeed = function() {
			//return this.moveSpeed * ratio;
			return this.moveSpeed;
		}
		this.getJumpHeight = function() {
			//return this.jumpHeight * ratio;
			return this.jumpHeight;
		}
		
		
		this.setMoveSpeed = function(val) {
			this.moveSpeed = val;
			return this;
		}
		this.setAttackSpeed = function(val) {
			this.attackSpeed = val;
			return this;
		}
		
		this.doDamage = function(target) {
			if (typeof target.takeDamage !== "function") { return; }
			
			var damage;
			
			damage = this.dmgMultiplier * this.baseDamage;
			target.takeDamage(damage);
		}
		
		this.takeDamage = function(dmg) {
			
			this.health -= dmg;
			
			
			if (this.health < 1) { this.die(); }
		}
		
		this.die = function() {
			console.log(this.name + " has died");
		}
		
		this.setTarget = function() {
			var i,
			    x,
			    y,
			    z;
			
				console.log(this);
			
			x = Math.round(Math.random() * map.bound.right);
			z = Math.round(Math.random() * map.bound.top);
			
			this.tar = {
				x:x,
				y:0,
				z:z,
			}
		}
		
		return this;
	}
	
	function Player(name) {
		Character.call(this, name);
		
		this.isPlayer = true;
	}
	
	
	function setPlayer(obj) {
		var i;
		
		for (i in c) { c[i].isPlayer = false; }
		
		obj.isPlayer = true;
		p = obj;
	}
	
	
	function drawBackground() {
		// Sky
		draw.color("#44CCFF");
		draw.box(0, 0, draw.canv.width, draw.canv.height);
		
		// Background
		draw.color("rgba(0, 200, 180, 1)");
		draw.box(0, map.bound.top - (100 * ratio), screen.width, screen.height);
		
		// Ground
		draw.color("#00DD55");
		draw.box(0, map.bound.top-(30 * ratio), screen.width, screen.height);
	}
	
	function drawCharacters() {
		var i,
		    x,
		    y,
		    z,
		    img;
		
		c.sort(function(a, b) {
			if (a.pos.z < b.pos.z) { return 1; }
			if (a.pos.z > b.pos.z) { return -1; }
			
			return 0;
		})
		
		for (i = 0; i < c.length; i++) {
			// ===================================================
			// Calculate the drawn position
			// ===================================================
			x = (c[i].pos.x * ratio) - map.offset;
			y = screen.height - c[i].pos.y * ratio;
			z = -1 * c[i].pos.z * ratio
			
			if (c[i].type === "Character") {
				
				// Shadow
				draw.color("rgba(0, 0, 0, .1)");
				draw.ball(x, screen.height + z - (7 * ratio), (20 * ratio));
				
				// Health bar
				draw.color("rgba(10, 110, 10, .95)");
				draw.box(x - (25 * ratio),
				         y + z - (130 * ratio)),
				         x + (25 * ratio),
				         y + z - (105 * ratio);
				
				draw.ctx.save();
				
				if (c[i].orientation === "left") {
					draw.ctx.translate(2 * x, 0);
					draw.ctx.scale(-1, 1);
				}

				// Character
				img = getAnimFrame(c[i]);
				draw.ctx.drawImage(img,
				                   x - (20 * ratio),
				                   y + z - (100 * ratio),
				                   (40 * ratio),
				                   (100 * ratio));
				
				// Weapon
				draw.ctx.drawImage(imgs.w.ls,
				                   x - (7 * ratio),
				                   y + z - (85 * ratio),
				                   (60 * ratio),
				                   (60 * ratio));
				
				draw.ctx.restore();
			}
			
			if (c[i].type === "Rock") {
				draw.color("#221144");
				draw.box(x - 10 - map.offset,
				         y + z - 10,
				         x + 10 - map.offset,
				         y + z + 10);
			}
		}
	}
	
	function getAnimFrame(obj) {
		if (obj.movingSince !== false && obj.isInFreefall === false) {
			switch ((2 * (Date.now() - obj.movingSince) >> 8)%4) {
				case 0:
				case 2:
					return imgs.p.s;
					break;
				case 1:
					return imgs.p.m1;
					break;
				case 3:
					return imgs.p.m2;
					break;
			}
		} else {
			return imgs.p.s;
		}
	}
	
	function addKey(e) {
		var i,
		    method;
		
		e.preventDefault();
		
		for (i in keys) {
			if (keys[i].key === e.key) {
				keys[i].pressed = true;
				
				if (keys.meta.pressed === true
				&& keys.fullscreen.pressed === true) {
					try { document.body.mozRequestFullScreen();	}
					catch(e) {}
					try { document.body.webkitRequestFullScreen(); }
					catch(e) {}
					try { document.body.requestFullScreen(); }
					catch(e) {}
				}
				return;
			}
		}
	}
	
	function removeKey(e) {
		var i;
		
		if (e.key === "Meta") {
			for (i in keys) { keys[i].pressed = false; }
			return;
		}
		
		for (i in keys) {
			if (keys[i].key === e.key) {
				keys[i].pressed = false;
				return;
			}
		}
	}
	
	function calculateField() {
		var i;
		
		screen.height = draw.canv.height;
		screen.width = draw.canv.width;
		
		map.bound.top = screen.height * 6/10;
		map.bound.right = map.bound.top * 5;
		
		ratio = screen.width/1400;
		
		for (i in c) {
			c[i].setPosition(c[i].pos);
		}
	}
	
	function loadImages(imgs) {
		var i,
		    img;
		
		for (i in imgs) {
			if (typeof imgs[i] === "object") { loadImages(imgs[i]); }
			
			if (typeof imgs[i] === "string") {
				img = new Image();
				img.src = "img/" + imgs[i] + "?" + Date.now();
				imgs[i] = img;
			}
		}
	}
	
	function init() {
		calculateField();
		loadImages(imgs);
		
		window.addEventListener("keydown", addKey);
		els.push({type:"keydown",fnc:addKey});
		
		window.addEventListener("keyup", removeKey);
		els.push({type:"keyup",fnc:removeKey});
		
		window.addEventListener("resize", calculateField);
		els.push({type:"resize",fnc:calculateField});
		
		var ch;
		
		p = new Player("Bob");
		p.setPosition({x:200, z:120, y:0});
		c.push(p);
		
		ch = new Character("Will");
		ch.setPosition({x:200, y:110, z:10});
		ch.setTarget();
		ch.vel.x = 10;
		c.push(ch);
		
		ch = new Object("Rock");
		ch.type = "Rock";
		ch.setPosition({x:0,y:0,z:50});
		c.push(ch);
		
		main();
	}
	
	function collision(ind, dir) {
		var i,
		    j,
		    buffer,
		    flag;
		
		buffer = 10;
		
		for (i in c) {
			if (i === ind) { continue; }
			
			flag = true;
			
			// Quick test - only perform collision detection on objects within a certain distance
			if (c[i].pos.x + c[i].dim.x > c[ind].pos.x - 100
			&& c[i].pos.x - 100 < c[ind].pos.x + c[ind].dim.x) {
				
				for (j in c[ind].dim) {
					if (j === dir) { continue; }
					
					if (c[ind].pos[j] + c[ind].dim[j] < c[i].pos[j]
					|| c[ind].pos[j] > c[i].pos[j] + c[i].dim[j]) {
						flag = false;
					}
				}
				
				if (flag === true) {
					if (c[ind].pos[dir] + c[ind].vel[dir] + c[ind].dim[dir] > c[i].pos[dir]
					&& c[ind].pos[dir] + c[ind].vel[dir] < c[i].pos[dir] + c[i].dim[dir]) {
						
						if (dir === "y") {
							if (c[i].pos.y < c[ind].pos.y) {
								// Landed on an object below
								c[ind].isInFreefall = false;
								c[ind].vel.y = 0;
							} else {
								// Object above
								c[ind].vel.y = 0;
							}
						}
						
						return true;
					}
				}
			}
			
		}
		
		return false;
	}
	
	function moveObjects() {
		var i,
		    j;
		
		for (i in c) {
			moveToTarget(c[i]);
			// ===================================================
			// Apply accelerations to determine velocity
			// ===================================================
			
			// Gravity
			c[i].vel.y = (c[i].pos.y > 0) ? c[i].vel.y - .3 : c[i].vel.y;
			
			// Friction
			if (c[i].isInFreefall === false) {
				c[i].vel.x = c[i].vel.x * .8;
				c[i].vel.z = c[i].vel.z * .8;
			}
			
			// ===================================================
			// Apply velocity to determine change in position
			// ===================================================
			for (j in c[i].vel) {
				if (collision(i, j)) { continue; }
				c[i].pos[j] += c[i].vel[j];
			}
			
			c[i].setPosition(c[i].pos);
		}
	}
	
	function moveToTarget(obj) {
		if (typeof obj.tar === "undefined") { return; }
		
		var buff;
		
		buff = 15;
		
		if (obj.pos.x + buff < obj.tar.x) { obj.moveRight(); }
		
		if (obj.pos.x > obj.tar.x + buff) { obj.moveLeft(); }
		
		if (obj.pos.z + buff < obj.tar.z) { obj.moveUp(); }
		
		if (obj.pos.z > obj.tar.z + buff) { obj.moveDown(); }
		
		if (obj.pos.x + buff >= obj.tar.x
		 && obj.pos.x - buff <= obj.tar.x
		 && obj.pos.z + buff >= obj.tar.z
		 && obj.pos.z - buff <= obj.tar.z) {
			obj.stopMovingX();
			obj.stopMovingZ();
			obj.jump();
			obj.movingSince = false;
			//setTimeout(function() { obj.setTarget; }, Math.round(Math.random() * 10000));
		}
	}
	
	// Debug helper function
	function showFrameRate() {
		var s;
		
		frameCount++;
		s = (Date.now() - t)/1000;
		
		draw.color("white");
		draw.text(frameRate, 5, 45);
		//draw.text(Math.round(p.pos.y), 5, 45);
		//draw.text(Math.round(map.offset), 5, 80);
		
		if (s > 0.1) {
			frameRate = Math.round(frameCount / s);
			t = Date.now();
			frameCount = 0;
		}
	}
	
	function showVar() {
		//var 
	}
	
	// Debug helper function
	function showPressedKeys() {
		var i,
		    pressed;
		
		pressed = [];
		for (i in keys) {
			if (keys[i].pressed === true) {
				pressed.push(keys[i].key);
			}
		}
		
		draw.text(pressed.join(", "), 5, 100);
	}
	
	// Turns key presses into actions
	function keyAction() {
		if (keys.left.pressed === true || keys.right.pressed === true || keys.up.pressed === true || keys.down.pressed === true && p.isInFreefall === false) {
			if (p.movingSince === false) { p.movingSince = Date.now(); }
		} else {
			p.movingSince = false;
		}
		
		// Directional movement
		if (keys.left.pressed === true) {	p.moveLeft();	}
		if (keys.right.pressed === true) { p.moveRight(); }
		if (keys.up.pressed === true) { p.moveUp(); }
		if (keys.down.pressed === true) { p.moveDown(); }
		
		// Jumping
		if (keys.jump.pressed === true) { p.jump();	}
		
		// No ice-skating, please
		if (keys.right.pressed === false && keys.left.pressed === false) { p.stopMovingX(); }
		if (keys.up.pressed === false && keys.down.pressed === false) { p.stopMovingZ(); }
		
		// Attack
		if (keys.attack.pressed === true && p.attacking === false) { p.attack(); }
	}
	
	function adjustMapOffset() {
		var offset;
		
		offset = (p.pos.x * ratio) - (screen.width * .4);
		
		if (offset < 0) { offset = 0; }
		if (offset > map.bound.right - screen.width) { offset = map.bound.right - screen.width; }
		
		map.offset = offset;
	}
	
	function main() {
		keyAction();
		moveObjects();
		adjustMapOffset();
		
		draw.refresh();
		
		drawBackground();
		drawCharacters();
		
		
		showFrameRate();
		//showPressedKeys();
		window.requestAnimationFrame(main);
	}
	
	init();
})();