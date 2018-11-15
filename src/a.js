
var VOID = -1, ROOM = 0, WALL = 1, ENEMY = 2, HEALTH = 3, ITEM = 4, DEBUG = 9;

function insertSorted(arr, obj) {
	var pos = 0;
	for (var i = 0; i < arr.length; i++, pos++){
		if (arr[i].dist > obj.dist) {
			break;
		}
	}
	arr.splice(pos, 0, obj);
}

function findSet(sets, vertex) {
	for (var i = 0; i < sets.length; i++){
		if (sets[i].indexOf(vertex) >= 0)
			return sets[i];
	}
}

function runKruskal(edges, vertices){
	var treeSets = [];
	var e = Array.from(edges);
	var count = 0;
	
	vertices.forEach(function(vertex){
		treeSets.push([vertex.toString()]);
	});
	
	e.forEach(function(edge){
		var vertices = edge.id.split('-');

		// Check if each vertex in different set
		var set_a = findSet(treeSets, vertices[0]);
		var set_b = findSet(treeSets, vertices[1]);

		if (set_a == set_b) {
			var index = edges.indexOf(edge);
			if (index >= 0)
				edges.splice(index, 1);
			count++;
		}
		else {
			var new_set = set_a.concat(set_b);
			var i_a = treeSets.indexOf(set_a);
			if (i_a >= 0) treeSets.splice(i_a, 1);
			var i_b = treeSets.indexOf(set_b);
			if (i_b >= 0) treeSets.splice(i_b, 1);
			treeSets.push(new_set);
		}
	});
}

function addPath(map, x, y, w){
	map[(y*w)+x] = ROOM;
	if (map[((y+1)*w)+x] == VOID)
		map[((y+1)*w)+x] = WALL;
	if (map[((y-1)*w)+x] == VOID)
		map[((y-1)*w)+x] = WALL;
	if (map[(y*w)+x+1] == VOID)
		map[(y*w)+x+1] = WALL;
	if (map[(y*w)+x-1] == VOID)
		map[(y*w)+x-1] = WALL;
}

function generateMap(w, h, min, max, retry) {
	// Initialize map with void
	var map = Array(h*w).fill(VOID);
	var rooms = {};
	
	// Try to place rooms
	var counter = 0;
	while (counter++ < retry) {
		// Randomize room size
		var rw = Math.floor(Math.random() * (max-min+1)) + min;
		var rh = Math.floor(Math.random() * (max-min+1)) + min;
		// Find random spot in map
		var x = Math.floor(Math.random() * (w-rw+1));
		var y = Math.floor(Math.random() * (h-rh+1));
		// Place if valid
		var isValid = true;
		for (var i = y; i < (y+rh); i++){
			for (var j = x; j < (x+rw); j++){
				if (map[(i*w)+j] !== VOID) {
					isValid = false;
					break;
				}
			}
			if (!isValid)
				break;
		}
		if (isValid){
			// console.log(counter+": "+  x+","+y +": " + rw+"x"+rh);
			rooms[counter] = ({
				id: counter,
				x: x, y: y, w: rw, h: rh
			});
			// Fill map with room
			for (var i = y; i < (y+rh); i++){
				for (var j = x; j < (x+rw); j++){
					map[(i*w)+j] = ROOM;
				}
			}
			// Fill room edges with wall
			for (var i = y-1; i < (y+rh+1); i++){
				if (i < 0 || i >= h) continue;
				for (var j = x-1; j < (x+rw+1); j++){
					if (j < 0 || j >= w || map[(i*w)+j] !== VOID) continue;
					map[(i*w)+j] = WALL;
				}
			}
		}
	}
	
	// Generate paths
	var edges = [];
	var vertices = [];
	var keys = Object.keys(rooms);
	keys.forEach(function(key, i){
		var room = rooms[key];
		var midX = Math.floor((room.x + room.w/2));
		var midY = Math.floor((room.y + room.h/2));
		room.path = {};
		vertices.push(room.id);
		
		for (var j = i+1; j < keys.length; j++){
			if (j === i) continue;
			
			var nextRoom = rooms[keys[j]];
			var nextmidX = Math.floor((nextRoom.x + nextRoom.w/2));
			var nextmidY = Math.floor((nextRoom.y + nextRoom.h/2));
			var id = nextRoom.id;
			var dist = Math.sqrt((Math.pow(midX-nextmidX, 2) + Math.pow(midY-nextmidY, 2)));
			
			insertSorted(edges, { id: room.id + "-" + id, dist: dist});
		}
	});
	
	// Get minimum spanning tree
	runKruskal(edges, vertices);
	
	edges.forEach(function(edge){
		var vertices = edge.id.split('-');
		rooms[parseInt(vertices[0])].path[parseInt(vertices[1])] = edge.dist; 
	});
	
	// Add paths to map
	function addHorizontalPath(leftRoom, rightRoom){
		var x1 = leftRoom.x, y1 = leftRoom.y, w1 = leftRoom.w, h1 = leftRoom.h;
		var x2 = rightRoom.x, y2 = rightRoom.y, w2 = rightRoom.w, h2 = rightRoom.h;
		var d_x1 = x1 + w1;
		var d_y1 = y1 + Math.floor(Math.random() * h1);
		var d_x2 = x2 - 1;
		var d_y2 = y2 + Math.floor(Math.random() * h2);
		var mid_x = d_x1 + Math.floor((d_x2 - d_x1)/2);
		var dir_y = (d_y2 - d_y1) / Math.abs(d_y2 - d_y1);

		var cur_x = d_x1, cur_y = d_y1;
		while (cur_x != mid_x){
			addPath(map, cur_x, cur_y, w);
			cur_x++;
		}
		while (cur_y != d_y2){
			addPath(map, cur_x, cur_y, w);
			cur_y += dir_y;
		}
		while (cur_x <= d_x2){
			addPath(map, cur_x, cur_y, w);
			cur_x++;
		}
	}
	
	function addVerticalPath(leftRoom, rightRoom){
		var x1 = leftRoom.x, y1 = leftRoom.y, w1 = leftRoom.w, h1 = leftRoom.h;
		var x2 = rightRoom.x, y2 = rightRoom.y, w2 = rightRoom.w, h2 = rightRoom.h;
		var d_x1 = x1 + Math.floor(Math.random() * w1);
		var d_y1 = y1 + h1;
		var d_x2 = x2 + Math.floor(Math.random() * w2);
		var d_y2 = y2 - 1;
		var mid_y = d_y1 + Math.floor((d_y2 - d_y1)/2);
		var dir_x = (d_x2 - d_x1) / Math.abs(d_x2 - d_x1);

		var cur_x = d_x1, cur_y = d_y1;
		while (cur_y != mid_y){
			addPath(map, cur_x, cur_y, w);
			cur_y++;
		}
		while (cur_x != d_x2){
			addPath(map, cur_x, cur_y, w);
			cur_x += dir_x;
		}
		while (cur_y <= d_y2){
			addPath(map, cur_x, cur_y, w);
			cur_y++;
		}
	}
	
	var roomKeys = Object.keys(rooms);
	roomKeys.forEach(function(roomKey){
		var room = rooms[roomKey];
		var x1 = room.x, y1 = room.y, w1 = room.w, h1 = room.h;
		var pathKeys = Object.keys(room.path);
		pathKeys.forEach(function(nextId){
			var nextRoom = rooms[nextId];
			var x2 = nextRoom.x, y2 = nextRoom.y, w2 = nextRoom.w, h2 = nextRoom.h;
			
			if (x1 + w1 < x2)
				addHorizontalPath(room, nextRoom);
			else if (x2 + w2 < x1)
				addHorizontalPath(nextRoom, room);
			else if (y1 + h1 < y2)
				addVerticalPath(room, nextRoom);
			else if (y2 + h2 < y1)
				addVerticalPath(nextRoom, room);
			else
				Math.random() > 0.5 ?
					addHorizontalPath(room, nextRoom)
					: addVerticalPath(room, nextRoom);
			
		});
	});
	
	return { map: map, rooms: rooms };
}

function generateGameObjects(w, h, rooms, paramObj){

	var roomKeys = Object.keys(rooms);
	var occupiedMap = Array(h*w).fill(false);
	
	function addGameObject(arr, offset=0){
		var room_id = roomKeys[ Math.floor(Math.random() * (roomKeys.length-1)) + 1 ];
		var room = rooms[room_id];
		var x = room.x + Math.floor(Math.random() * (room.w - offset*2) ) + offset;
		var y = room.y + Math.floor(Math.random() * (room.h - offset*2) ) + offset;
		while (occupiedMap[(y*w) + x]){
			x = room.x + Math.floor(Math.random() * (room.w - offset*2) ) + offset;
			y = room.y + Math.floor(Math.random() * (room.h - offset*2) ) + offset;
		}
		arr.push({ x: x, y: y });
		occupiedMap[ (y*w) + x] = true;
	}
	
	var enemies = [], healths = [], items = [], stairs = [];
	var objKeys = Object.keys(paramObj);
	objKeys.forEach(function(key){
		var count = 0;
		while (++count <= paramObj[key].count){
			
			switch (key) {
				case "enemy":
					addGameObject(enemies);
					var enemy = enemies[enemies.length - 1];
					enemy.id = count;
					enemy.hp = paramObj[key].stats[count - 1].hp;
					enemy.atk = paramObj[key].stats[count - 1].atk;
					enemy.exp = paramObj[key].stats[count - 1].exp;
					break;
				case "health":
					addGameObject(healths);
					var health = healths[healths.length - 1];
					health.id = count;
					health.hp = paramObj[key].stats[count - 1].hp;
					break;
				case "item":
					addGameObject(items);
					var item = items[items.length - 1];
					item.id = count;
					item.atk = paramObj[key].stats[count - 1].atk;
					item.name = paramObj[key].stats[count - 1].name;
					break;
				case "stair":
					addGameObject(stairs, 1);
					break;
			}
			
		}
	});
	
	return { enemies: enemies, healths: healths, items: items, stairs: stairs };
}

var Enemy = function(game, group, param, index, charW){
	var enemy_bmd = game.add.bitmapData(charW, charW);
	enemy_bmd.ctx.beginPath();
	enemy_bmd.ctx.rect(0,0,charW,charW);
	enemy_bmd.ctx.fillStyle = "#FF0000";
	enemy_bmd.ctx.fill();
	
	this.sprite = group.create(param.x*charW, param.y*charW, enemy_bmd);
	this.sprite.name = index.toString();
	this.sprite.body.immovable = true;
	
	this.hp = param.hp;
	this.atk = param.atk;
	this.exp = param.exp;
};

var MainChar = function(game, x, y, charW, props, stats){
	
	var mainchar_bmd = game.add.bitmapData(charW-5, charW-5);
	mainchar_bmd.ctx.beginPath();
	mainchar_bmd.ctx.rect(0,0,charW-5,charW-5);
	mainchar_bmd.ctx.fillStyle = "#FFFFFF";
	mainchar_bmd.ctx.fill();

	this.sprite = game.add.sprite(x, y, mainchar_bmd);
	game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.enableBody = true;
	this.sprite.body.collideWorldBounds = true;

	game.camera.follow(this.sprite); 
	
	this.setPos = function(x, y){
		this.sprite.x = x;
		this.sprite.y = y;
	};
	
	this.level = 1;
	this.hp = 100;
	this.atk = stats[this.level-1].atk;
	this.nextExp = stats[this.level-1].nextExp;
	this.item = { name: "Knuckle", atk: 0 };
	
	this.setHp = function(hp){
		this.hp = hp;
		props.onHpChange(this.hp);
	};
	
	this.setAtk = function(atk){
		this.atk = atk;
		props.onAtkChange(this.atk + ( this.item != null ? this.item.atk : 0 ));
	};
	
	this.setNextExp = function(exp){
		this.nextExp = exp;
		props.onExpChange(this.nextExp);
	};
	
	this.setLevel = function(level){
		this.level = level;
		this.setAtk(stats[this.level-1].atk);
		this.setNextExp(stats[this.level-1].nextExp);
		props.onLevelChange(this.level);
	};
	
	this.damaged = function(dmg){
		this.setHp(this.hp - dmg);
	};
	
	this.addExp = function(exp){
		this.nextExp -= exp;
		
		if (this.nextExp <= 0){
			this.setLevel(this.level + 1);
			this.nextExp += stats[this.level-1].nextExp;
			this.setAtk(stats[this.level-1].atk);
		}
		
		props.onExpChange(this.nextExp);
	};
	
	this.equipItem = function(item){
		if (!item)
			item = { name: "Knuckle", atk: 0 };
		this.item = item;
		props.onItemChange(this.item.name);
		props.onAtkChange(this.atk + ( this.item != null ? this.item.atk : 0 ));
	};
	
	this.damaged(0);
	this.addExp(0);
	this.equipItem(this.item);
};

var Item = function(game, group, param, index, charW){
		
	var item_bmd = game.add.bitmapData(charW, charW);
	item_bmd.ctx.beginPath();
	item_bmd.ctx.rect(0,0,charW,charW);
	item_bmd.ctx.fillStyle = "#AAAA00";
	item_bmd.ctx.fill();
	
	this.sprite = group.create(param.x*charW, param.y*charW, item_bmd);
	this.sprite.name = index.toString();
	this.sprite.body.immovable = true;
	
	this.name = param.name;
	this.atk = param.atk;
};

var Health = function(game, group, param, index, charW){
		
	var health_bmd = game.add.bitmapData(charW, charW);
	health_bmd.ctx.beginPath();
	health_bmd.ctx.rect(0,0,charW,charW);
	health_bmd.ctx.fillStyle = "#00FF00";
	health_bmd.ctx.fill();
	
	this.sprite = group.create(param.x*charW, param.y*charW, health_bmd);
	this.sprite.name = index.toString();
	this.sprite.body.immovable = true;
	
	this.hp = param.hp;
};

var Stair = function(game, group, param, index, charW){
		
	var bmd = game.add.bitmapData(charW, charW);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0,0,charW,charW);
	bmd.ctx.fillStyle = "#FF00FF";
	bmd.ctx.fill();
	
	this.sprite = group.create(param.x*charW, param.y*charW, bmd);
	this.sprite.name = index.toString();
	this.sprite.body.immovable = true;
};

var PhaserContainer = React.createClass({
	
	game: null,
	sprites: {},
	cursors: null,
	bodies: {},
	mainchar: null,
	enemies: [],
	items: [],
	healths: [],
	stairs: [],
	floor: 1,
	killCount: 0,
	useMask: true,
	shadowTexture: null,
	keyTimer: 0,
	consts: { speed: 200, charW: 20, stageW: 1200,
					 	rmin: 5, rmax: 10, retry: 10,
					 	maincharstats: [
							{atk: 2, nextExp: 50},
							{atk: 4, nextExp: 80},
							{atk: 8, nextExp: 120},
							{atk: 16, nextExp: 1000000},
						],
					 	levelParams: [ 
							{ 
								rooms_retry: 20,
								enemy: { count: 5, stats: [ {hp: 10, atk: 2, exp: 10}, {hp: 10, atk: 2, exp: 10}, {hp: 10, atk: 2, exp: 10}, {hp: 10, atk: 2, exp: 10}, {hp: 10, atk: 2, exp: 10} ] },
								health: { count: 2, stats: [ {hp: 50},{hp: 50} ] },
								item: { count: 1, stats: [ {name: "Dagger", atk: 5} ] },
								stair: { count: 1 }
							},
							{ 
								rooms_retry: 20,
								enemy: { count: 10, stats: [ {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20}, {hp: 20, atk: 5, exp: 20} ] },
								health: { count: 2, stats: [ {hp: 75},{hp: 75} ] },
								item: { count: 1, stats: [ {name: "Sword", atk: 10} ] },
								stair: { count: 1 }
							},
							{ 
								rooms_retry: 3,
								enemy: { count: 1, stats: [ {hp: 100, atk: 20, exp: 0} ] },
								health: { count: 1, stats: [ {hp: 75} ] },
								item: { count: 1, stats: [ {name: "Hammer", atk: 15} ] },
								stair: { count: 0 }
							},
						]
					},
	
	resetGame: function(){
		this.mainchar.setHp(100);
		this.mainchar.setLevel(1);
		this.mainchar.equipItem();
		
		this.floor = 1;
		this.props.onFloorChange(this.floor);
		this.createFloor();
	},
	
	nextFloor: function(){
		this.floor++;
		this.props.onFloorChange(this.floor);
		this.createFloor();
	},
	
	createFloor: function(){
		var self = this;
		
		var gridW = this.consts.stageW/this.consts.charW;
		var charW = this.consts.charW;
		var stageW = this.consts.stageW;
		var rmin = this.consts.rmin;
		var rmax = this.consts.rmax;
		var retry = this.consts.retry;
		
		var wall_bmd = this.game.add.bitmapData(charW, charW);
		wall_bmd.ctx.beginPath();
		wall_bmd.ctx.rect(0,0,charW,charW);
		wall_bmd.ctx.fillStyle = "#000000";
		wall_bmd.ctx.fill();
		var room_bmd = this.game.add.bitmapData(charW, charW);
		room_bmd.ctx.beginPath();
		room_bmd.ctx.rect(0,0,charW,charW);
		room_bmd.ctx.fillStyle = "#666666";
		room_bmd.ctx.fill();
		var debug_bmd = this.game.add.bitmapData(charW, charW);
		debug_bmd.ctx.beginPath();
		debug_bmd.ctx.rect(0,0,charW,charW);
		debug_bmd.ctx.fillStyle = "#66FF66";
		debug_bmd.ctx.fill();
		
		this.bodies.wall.removeAll(true);
		this.sprites.room.removeAll(true);
		
		this.bodies.enemies.removeAll(true);
		this.bodies.items.removeAll(true);
		this.bodies.healths.removeAll(true);
		this.bodies.stairs.removeAll(true);
		
		this.enemies.length = 0
		this.items.length = 0
		this.healths.length = 0
		this.stairs.length = 0
		
		var mapObj = generateMap(gridW, gridW, rmin, rmax, this.consts.levelParams[this.floor - 1].rooms_retry);
		mapObj.map.forEach(function(g, pos){
			if (g === VOID) return;
			var x = Math.floor(pos%gridW);
			var y = Math.floor(pos/gridW);
			var bmd, r;
			switch(g) {
				case ROOM:
					bmd = room_bmd;
					r = self.sprites.room.create(x*charW, y*charW, bmd);
					break;
				case WALL:
					bmd = wall_bmd;
					r = self.bodies.wall.create(x*charW, y*charW, bmd);
					r.body.immovable = true;
					break;
				default:
					bmd = debug_bmd;
					r = self.sprites.room.create(x*charW, y*charW, bmd);
					break;
			}
		});
		
		var gameObjs = generateGameObjects(gridW, gridW, mapObj.rooms, this.consts.levelParams[this.floor - 1]);
		gameObjs.enemies.forEach(function(enemy, index){
			self.enemies.push( new Enemy(self.game, self.bodies.enemies, enemy, index, charW) );
		});
		gameObjs.items.forEach(function(item, index){
			self.items.push( new Item(self.game, self.bodies.items, item, index, charW) );
		});
		gameObjs.healths.forEach(function(health, index){
			self.healths.push( new Health(self.game, self.bodies.healths, health, index, charW) );
		});
		gameObjs.stairs.forEach(function(stair, index){
			self.stairs.push( new Stair(self.game, self.bodies.stairs, stair, index, charW) );
		});
		var roomKeys = Object.keys(mapObj.rooms);
		
		var start_x = (mapObj.rooms[roomKeys[0]].x + mapObj.rooms[roomKeys[0]].w/2) * charW;
		var start_y = (mapObj.rooms[roomKeys[0]].y + mapObj.rooms[roomKeys[0]].h/2) * charW;
		
		this.mainchar.setPos(start_x, start_y);
		this.killCount = 0;
		this.updateShadowTexture();
	},
	
	create: function(){
		var self = this;
		
		var gridW = this.consts.stageW/this.consts.charW;
		var charW = this.consts.charW;
		var stageW = this.consts.stageW;
		var rmin = this.consts.rmin;
		var rmax = this.consts.rmax;
		var retry = this.consts.retry;
		
		this.game.world.setBounds(0, 0, this.consts.stageW, this.consts.stageW);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.bodies.wall = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.sprites.room = this.game.add.group();
		
		this.bodies.enemies = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.bodies.items = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.bodies.healths = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.bodies.stairs = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		
		// var path_g = this.game.add.graphics();
		// var roomKeys = Object.keys(mapObj.rooms);
		// roomKeys.forEach(function(key, i){
		// 	var room = mapObj.rooms[key];
		// 	var midX = Math.floor((room.x + room.w/2)) * charW;
		// 	var midY = Math.floor((room.y + room.h/2)) * charW;
			
// 			var text = self.game.add.text(room.x * charW, room.y * charW, room.id, { font: "20px Arial", fill: "#FF0000"});
			
// 			path_g.lineStyle(1, 0x00FF00, 1);
// 			var pathKeys = Object.keys(room.path);
// 			pathKeys.forEach(function(pathKey){
// 				var nextRoom = mapObj.rooms[pathKey];
// 				var nextmidX = Math.floor((nextRoom.x + nextRoom.w/2)) * charW;
// 				var nextmidY = Math.floor((nextRoom.y + nextRoom.h/2)) * charW;
// 				path_g.moveTo(midX, midY);
// 				path_g.lineTo(nextmidX, nextmidY);	
// 			});
		// });
		this.shadowTexture = this.game.add.bitmapData(this.game.width + 20, this.game.height + 20);
		this.sprites.lightSprite = this.game.add.image(0, 0, this.shadowTexture);
		this.sprites.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
		
		var callbacks = {
			onHpChange: this.props.onHpChange,
			onAtkChange: this.props.onAtkChange,
			onLevelChange: this.props.onLevelChange,
			onItemChange: this.props.onItemChange,
			onExpChange: this.props.onExpChange,
		};
		this.mainchar = new MainChar(this.game, 0, 0, charW, callbacks, this.consts.maincharstats);
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.useMask = this.props.useMask;
		
		this.resetGame();
	},
	
	battle: function(mainSpr, enemySpr){
		
		var body = mainSpr.body;
		var speed = this.consts.speed;
		if (body.touching.up)
			body.velocity.y = speed;
		if (body.touching.down)
			body.velocity.y = -speed;
		if (body.touching.left)
			body.velocity.x = speed;
		if (body.touching.right)
			body.velocity.x = -speed;
		
		var enemy = this.enemies[parseInt(enemySpr.name)];
		
		this.mainchar.damaged(enemy.atk + Math.floor(Math.random() * 10));
		if (this.mainchar.hp <= 0) {
			this.props.onGameEnd(false);
			this.resetGame();
			return;
		}
		
		enemy.hp -= this.mainchar.atk + ( this.mainchar.item != null ? this.mainchar.item.atk : 0 );
		if (enemy.hp <= 0) {
			this.mainchar.addExp(enemy.exp);
			enemySpr.kill();
			this.killCount++;
			
			if (this.stairs.length === 0 && this.killCount === this.enemies.length) {
				this.props.onGameEnd(true);
				this.resetGame();
			}
		}
	},
	
	equip: function(mainSpr, itemSpr){
		var item = this.items[parseInt(itemSpr.name)];
		this.mainchar.equipItem({ name: item.name, atk: item.atk });
		itemSpr.kill();
	},
	
	heal: function(mainSpr, healthSpr){
		var health = this.healths[parseInt(healthSpr.name)];
		this.mainchar.damaged(-health.hp);
		healthSpr.kill();
	},
	
	updateShadowTexture: function(){
		if (!this.useMask){
			this.sprites.lightSprite.visible = false;
			return;
		}
		
		this.sprites.lightSprite.reset(this.game.camera.x - 10, this.game.camera.y - 10);
		
		var mc = this.mainchar.sprite;
		var ctx = this.shadowTexture.context;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, this.game.width + 20, this.game.height + 20);
		
		var x = mc.x - this.game.camera.x + 20, y = mc.y - this.game.camera.y + 20;
		var gradient = ctx.createRadialGradient(
			x, y, 100 * 0.75,
			x, y, 100
		);
		gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");
		ctx.beginPath();
		ctx.fillStyle = gradient;
		ctx.arc(x, y, 100, 0, Math.PI*2);
		ctx.fill();
		
		this.shadowTexture.dirty = true;
	},
	
	update: function(){
		var mc = this.mainchar.sprite.body;
		var spr = this.mainchar.sprite;
		
		this.game.physics.arcade.collide(this.mainchar.sprite, this.bodies.wall);
		this.game.physics.arcade.collide(this.mainchar.sprite, this.bodies.enemies, this.battle);
		this.game.physics.arcade.collide(this.mainchar.sprite, this.bodies.items, this.equip);
		this.game.physics.arcade.collide(this.mainchar.sprite, this.bodies.healths, this.heal);
		this.game.physics.arcade.collide(this.mainchar.sprite, this.bodies.stairs, this.nextFloor);
		
		// mc.velocity.x = 0;
		// mc.velocity.y = 0;
		
		if (this.cursors.left.isDown) {
			mc.velocity.y = 0;
			if (mc.velocity.x > -this.consts.speed)
				mc.velocity.x -= this.consts.speed/20;
			// if (this.keyTimer < 30)
			// 	this.keyTimer++;
			// else {
			// 	spr.x -= this.consts.charW;
			// 	this.keyTimer = 0;
			// }
		}
		else if (this.cursors.right.isDown) {
			mc.velocity.y = 0;
			if (mc.velocity.x < this.consts.speed)
				mc.velocity.x += this.consts.speed/20;
			// if (this.keyTimer < 30)
			// 	this.keyTimer++;
			// else {
			// 	spr.x += this.consts.charW;
			// 	this.keyTimer = 0;
			// }
		}
		else if (this.cursors.up.isDown) {
			mc.velocity.x = 0;
			if (mc.velocity.y > -this.consts.speed)
				mc.velocity.y -= this.consts.speed/20;
			// if (this.keyTimer < 30)
			// 	this.keyTimer++;
			// else {
			// 	spr.y -= this.consts.charW;
			// 	this.keyTimer = 0;
			// }
		}
		else if (this.cursors.down.isDown) {
			mc.velocity.x = 0;
			if (mc.velocity.y < this.consts.speed)
				mc.velocity.y += this.consts.speed/20;
			// if (this.keyTimer < 30)
			// 	this.keyTimer++;
			// else {
			// 	spr.y += this.consts.charW;
			// 	this.keyTimer = 0;
			// }
		}
		else {
			mc.velocity.x = 0;
			mc.velocity.y = 0;
			// this.keyTimer = 0;
		}
		
		this.updateShadowTexture();
	},
	
	componentDidMount: function(){
		this.game = new Phaser.Game(800, 400, Phaser.AUTO, "phaser-container", 
																{ 
																	create: this.create,
																	update: this.update
																}
															 );
	},
	
	componentWillReceiveProps: function(nextProps){
		this.useMask = nextProps.useMask;
	},
	
	shouldComponentUpdate: function(nextProps, nextState){
		return false;
	},
	
	render: function(){
		return (
			<div className="phaserContainer" id="phaser-container">
			</div>
		);
	}
	
});

var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;

var Page = React.createClass({
	
	getInitialState: function(){
		return { hp: 100, atk: 2, item: null, level: 1, nextExp: 100, floor: 1, alertVisible: false, status: "win",
					 useMask: true};
	},
	
	handleHpChange: function(newHp){this.setState({ hp: newHp });	},
	handleAtkChange: function(newAtk){this.setState({ atk: newAtk });	},
	handleItemChange: function(newItemName){this.setState({item: newItemName})},
	handleLevelChange: function(newLevel){this.setState({ level: newLevel });	},
	handleExpChange: function(newExp){this.setState({ nextExp: newExp });	},
	handleFloorChange: function(newFloor){this.setState({ floor: newFloor });	},
	handleGameEnd: function(isWin){
		if (isWin) {
			this.setState({ alertVisible: true, status: "win" });
		}
		else {
			this.setState({ alertVisible: true, status: "lose" });
		}
	},
	
	handleAlertDismiss: function(){ this.setState({ alertVisible: false }); },
	handleToggleMask: function(){ this.setState({ useMask: !this.state.useMask }); },
	
	render: function(){
		var alert, alertclass;
		var message;
		
		if (this.state.status === "win") {
			message = "Congratulations!";
			alertclass = "success";
		}
		else {
			message = "You are defeated! Try Again!";
			alertclass = "danger";
		}
		
		if (this.state.alertVisible)
			alert = <Alert bsStyle={alertclass} onDismiss={this.handleAlertDismiss}><strong>{message}</strong></Alert>;
		else
			alert = "";
		
		return (
			<div className="container">
				{alert}
				<div className="panel">
					<span>HP: {this.state.hp}</span>
					<span>Atk: {this.state.atk}</span>
					<span>Item: {this.state.item}</span>
					<span>Level: {this.state.level}</span>
					<span>Next Exp: {this.state.nextExp}</span>
					<span>Floor: {this.state.floor}</span>
					<Button onClick={this.handleToggleMask}>Toggle Mask</Button>
					<div className="legend">
						<span className="white">Player</span>
						<span className="red">Enemy</span>
						<span className="green">Health</span>
						<span className="gold">Item</span>
						<span className="purple">Stairs</span>
					</div>
				</div>
				<PhaserContainer
					onHpChange={this.handleHpChange}
					onAtkChange={this.handleAtkChange}
					onItemChange={this.handleItemChange}
					onLevelChange={this.handleLevelChange}
					onExpChange={this.handleExpChange}
					onFloorChange={this.handleFloorChange}
					onGameEnd={this.handleGameEnd}
					useMask={this.state.useMask}
					/>
			</div>
		);
	}
});

ReactDOM.render(<Page />, document.getElementById("react-mount"));