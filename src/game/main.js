game.module(
	'game.main'
).require(
	'plugins.box2d'
).body(function() {
	
	game.addAsset('bubble.png');
	game.addAsset('panda.png');
	game.addAsset('basura/banana2.png');
	game.addAsset('basura/fondo.png');
	game.addAsset('basura/plataforma_front.png');
	game.addAsset('basura/plataforma.png');
 
	game.addAsset('rodillo.png');
	game.addAsset('rodillo0001.png');
	game.addAsset('rodillo.json');
	game.addAsset('button1a.png');
	game.addAsset('button1b.png');

	game.createClass('Wall', 'Graphics', {
		init: function(x, y, width, height) {
			
			this._super();
			
			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};
            //set linestyle and draw rectangle
            this.lineStyle (2, 0x7c2f01);
            this.beginFill(0xda633e, 1);
            this.drawRect(0, 0, width, height);
            this.endFill();
            this.drawRect(0, 0, width, height);   //x, y, width, height
			this.addTo(game.scene.stage);

			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(x + width / 2) * game.Box2D.SCALE,
				(y + height / 2) * game.Box2D.SCALE
			); 
			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
			bodyDef.type = game.Box2D.Body.b2_staticBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				width / 2 * game.Box2D.SCALE,
				height / 2 * game.Box2D.SCALE
			);
			fixtureDef.density = 0;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.

			game.scene.addObject(this);
			
		}
		
	});
	game.createClass('PlataformaFront', 'Sprite', {
		
		init: function(x, y) {

			this._super('basura/plataforma_front.png', x, y, {anchor: { x: 1, y: 1 }, scale: {x: 1.3, y: 1.3}});
			game.scene.addObject(this);
			this.addTo(game.scene.stage);
			//create a body using a body definition
			/*
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(this.position.x-500 + this.width / 2) * game.Box2D.SCALE,
				(this.position.y-500 + this.height / 2) * game.Box2D.SCALE
			); 

			this.basePos = 5;
			this.startingPos = 5;

			this.positionsX = [
				0,
				game.system.width * 9/100,
				game.system.width * 20/100,
				game.system.width * 32/100,
				game.system.width * 44/100,
				game.system.width * 56/100,
				game.system.width * 68/100,
				game.system.width * 79/100,
				game.system.width * 91/100,
				game.system.width * 100/100,
			]

			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};
			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
			bodyDef.type = game.Box2D.Body.b2_kinematicBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				1,
				1
			);
			fixtureDef.density = 0;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.
*/
			game.scene.addObject(this);
		},
	    remove: function() {
	        game.scene.removeObject(this);
	        //game.scene.world.removeBody(this.body);
	        //game.scene.Box2Dworld.DestroyBody(this.body);
	        game.scene.stage.removeChild(this);
	    }
		/*
		,
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot
			var p = this.body.GetPosition();
			//var p = {x : x, y : y};
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			//stops when is on right position
			if (this.position.x > this.positionsX[this.basePos]+4 || this.position.x < this.positionsX[this.basePos]-4){
				if (this.position.x > this.positionsX[this.basePos]) {
			//		this.body.m_linearVelocity.x = -6;
					this.stopped = true;
				} else if (this.position.x < this.positionsX[this.basePos]) {
			//		this.body.m_linearVelocity.x = 6;
					this.stopped = true;
				}
				console.log("reposicionando: "+this.basePos+" Vel: "+this.body.m_linearVelocity.x);
			} else {
				console.log("posicion fija: "+this.basePos+" vel: "+this.body.m_linearVelocity.x);
				this.body.m_linearVelocity.x = 0;
				this.stopped = true;
			}

		},
		toRight: function(){
			console.log(this.body.GetPosition());
			console.log(this.basePos);
			if (this.basePos < 10) {
				//this.stopped = false;
				this.basePos++;
				//The box2D world keeps track of the movement and position of the body.
				//use the update function to get the sprite in the right spot
				var p = this.body.GetPosition();
				//var p = {x : x, y : y};
				this.position.x = p.x / game.Box2D.SCALE;
				this.position.y = p.y / game.Box2D.SCALE;
				this.rotation = this.body.GetAngle().round(2);
				var x = this.position.x;
				var y = this.position.y;
			//	this.body.linearVelocity = {x:1,y:1};
				this.body.m_linearVelocity.x = 2;
			}

		},
		toLeft: function(){
			if (this.basePos > 0) {
				//this.stopped = false;
				//this.movingRight = false;
				this.basePos--;
				//The box2D world keeps track of the movement and position of the body.
				//use the update function to get the sprite in the right spot
				var p = this.body.GetPosition();
				//var p = {x : x, y : y};
				this.position.x = p.x / game.Box2D.SCALE;
				this.position.y = p.y / game.Box2D.SCALE;
				this.rotation = this.body.GetAngle().round(2);
				var x = this.position.x;
				var y = this.position.y;
			//	this.body.linearVelocity = {x:1,y:1};
				this.body.m_linearVelocity.x = -2;
			}
		}
		*/
	});
	game.createClass('Wall2', 'Graphics', {

		interactive: true,
		mouse: {x:100, y: 100},

		init: function(x, y, width, height, basePos) {
			
			this._super();

			this.basePos = basePos;
			this.startingPos = basePos;

			this.stopped = true;
			this.movingRight = true;

			this.positionsX = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				game.system.width * 9/100,
				game.system.width * 20/100,
				game.system.width * 32/100,
				game.system.width * 44/100,
				game.system.width * 56/100,
				game.system.width * 68/100,
				game.system.width * 79/100,
				game.system.width * 91/100,
				game.system.width * 100/100,
				game.system.width * 100/100,
				game.system.width * 100/100,
				game.system.width * 100/100,
				game.system.width * 100/100,
				game.system.width * 100/100,
				game.system.width * 100/100
			]
			
			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};
            //set linestyle and draw rectangle
            /*
            this.lineStyle (2, 0x7c2f01);
            this.beginFill(0xda633e, 1);
            this.drawRect(0, -50, width, height);
            this.endFill();
            this.drawRect(0, -50, width, height);   //x, y, width, height
			this.addTo(game.scene.stage);
*/
			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(x + width / 2) * game.Box2D.SCALE,
				(y + height / 2) * game.Box2D.SCALE
			); 

			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
		//	bodyDef.type = game.Box2D.Body.b2_kinematicBody;	
			bodyDef.type = game.Box2D.Body.b2_staticBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				width / 2 * game.Box2D.SCALE,
				height / 2 * game.Box2D.SCALE
			);
			fixtureDef.density = 0;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.

			game.scene.addObject(this);
			
		},
/*
		
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot
			var p = this.body.GetPosition();
			//var p = {x : x, y : y};
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			//stops when is on right position
			if (this.position.x > this.positionsX[this.basePos]) {
				this.body.m_linearVelocity.x = -6;
				this.stopped = true;
			} else if (this.position.x < this.positionsX[this.basePos]) {
				this.body.m_linearVelocity.x = 6;
				this.stopped = true;
			}
		},
		
		toRight: function(){
			if (this.basePos < 21 && this.stopped) {
				this.stopped = false;
				this.basePos++;
				//The box2D world keeps track of the movement and position of the body.
				//use the update function to get the sprite in the right spot
				var p = this.body.GetPosition();
				//var p = {x : x, y : y};
				this.position.x = p.x / game.Box2D.SCALE;
				this.position.y = p.y / game.Box2D.SCALE;
				this.rotation = this.body.GetAngle().round(2);
				var x = this.position.x;
				var y = this.position.y;
			//	this.body.linearVelocity = {x:1,y:1};
				this.body.m_linearVelocity.x = 2;
			}
		},
		toLeft: function(){
			if (this.basePos > 0 && this.stopped) {
				this.stopped = false;
				this.movingRight = false;
				this.basePos--;
				//The box2D world keeps track of the movement and position of the body.
				//use the update function to get the sprite in the right spot
				var p = this.body.GetPosition();
				//var p = {x : x, y : y};
				this.position.x = p.x / game.Box2D.SCALE;
				this.position.y = p.y / game.Box2D.SCALE;
				this.rotation = this.body.GetAngle().round(2);
				var x = this.position.x;
				var y = this.position.y;
			//	this.body.linearVelocity = {x:1,y:1};
				this.body.m_linearVelocity.x = -2;
			}
		}
		*/
	});


	game.createClass('Eslabon', 'Graphics', {

		interactive: true,

		init: function(x, y, movement) {
			
			this._super();

			this.startingPos = {x: x, y: y};
			this.movement = 0.5;
			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};
            //set linestyle and draw rectangle
            /*
            this.lineStyle (2, 0x7c2f01);
            this.beginFill(0xda633e, 1);
            this.drawRect(0, -50, 20, 20);
            this.endFill();
            this.drawRect(0, -50, 20, 20);   //x, y, width, height
			this.addTo(game.scene.stage);
*/
			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
					this.startingPos.x*100/game.system.width,
					this.startingPos.y*100/game.system.height
			); 

			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
			bodyDef.type = game.Box2D.Body.b2_kinematicBody;	
		//	bodyDef.type = game.Box2D.Body.b2_staticBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				650 / 2 * game.Box2D.SCALE,
				20 / 2 * game.Box2D.SCALE
			);
			fixtureDef.density = 4;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.
			this.body.m_linearVelocity.x = 20
			game.scene.addObject(this);
			
		},

		
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot
			var p = this.body.GetPosition();
			//var p = {x : x, y : y};
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			//stops when is on right position
			if (p.x > this.startingPos.x *100/game.system.width + this.movement) {
				this.body.SetPosition({
					x: this.startingPos.x*100/game.system.width,
					y: this.startingPos.y*100/game.system.height
				})
			}
		}
	});
	game.createClass('Eslabon2', 'Graphics', {

		interactive: true,

		init: function(x, y) {
			
			this._super();

			this.startingPos = {x: x+8, y: y+20};
			this.movement = 0.5;
			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};
            //set linestyle and draw rectangle
            /*
            this.lineStyle (2, 0x7c2f01);
            this.beginFill(0xda633e, 1);
            this.drawRect(0, -50, 20, 20);
            this.endFill();
            this.drawRect(0, -50, 20, 20);   //x, y, width, height
			this.addTo(game.scene.stage);
*/
			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
					this.startingPos.x*100/game.system.width,
					this.startingPos.y*100/game.system.height
			); 

			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
			bodyDef.type = game.Box2D.Body.b2_kinematicBody;	
		//	bodyDef.type = game.Box2D.Body.b2_staticBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				680 / 2 * game.Box2D.SCALE,
				60 / 2 * game.Box2D.SCALE
			);
			fixtureDef.density = 4;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.
			game.scene.addObject(this);
			
		}
	});

	game.createClass('Cinta', 'Graphics', {
		init: function(x, y, width, height) {
			
			this._super();
			
			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};

			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(x + width / 2) * game.Box2D.SCALE,
				(y + height / 2) * game.Box2D.SCALE
			); 
			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
			bodyDef.type = game.Box2D.Body.b2_staticBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				width / 2 * game.Box2D.SCALE,
				height / 2 * game.Box2D.SCALE
			);
			fixtureDef.density = 0;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.

			game.scene.addObject(this);
			
		}
		
	});
	

	game.createClass('Plataforma', 'Sprite', {
		
		init: function(x, y) {

			this._super('plataforma.png', x, y, {anchor: { x: 0.5, y: 0.5 }});
			game.scene.addObject(this);
			this.addTo(game.scene.stage);

			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(x + width / 2) * game.Box2D.SCALE,
				(y + height / 2) * game.Box2D.SCALE
			); 
			//We make the wall a StaticBody (which is actually the default type).
			//Mobile bodies are defined as b2_dynamicBody as we will see later on
			bodyDef.type = game.Box2D.Body.b2_staticBody;	
			//Now create the actual body from the definition.
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			
			//In order to handle collision, we have to add a fixture (= the shape) of the body.
			//First we set up a fixture definition which will be used to create the actual fixture later on.
			//(Starting to see the pattern already?)
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
				width / 2 * game.Box2D.SCALE,
				height / 2 * game.Box2D.SCALE
			);
			fixtureDef.density = 0;
			this.body.CreateFixture(fixtureDef);
			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.

			game.scene.addObject(this);
		},
		
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot
			var p = this.body.GetPosition();
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			this.rotation = this.body.GetAngle().round(2);
		}
	});
	
	game.createClass('Bubble', 'Sprite', {
		
		init: function(x, y) {

			this._super('bubble.png', x, y, {anchor: { x: 0.5, y: 0.5 }});
			game.scene.addObject(this);
			this.addTo(game.scene.stage);

			//create a body using a body definition
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(this.position.x + this.width / 2) * game.Box2D.SCALE,
				(this.position.y + this.height / 2) * game.Box2D.SCALE
			); 
			bodyDef.type = game.Box2D.Body.b2_dynamicBody;	//type is dynamicBody now!
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			//and the fixture
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.CircleShape(30 * game.Box2D.SCALE); //15 is the radius of the bubble
			//The following features add some extra juice to our bubble so it will respond in a more realistic way
			fixtureDef.density = 0.1;		//density has influence on collisions
			fixtureDef.friction = 0.5;		//A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
			fixtureDef.restitution = 0.9;	//=Bounciness (range: 0-1).
			this.body.CreateFixture(fixtureDef);
		},
		
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot
			var p = this.body.GetPosition();
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			this.rotation = this.body.GetAngle().round(2);
			if (this.position.y > game.system.height - 170) {
				this.remove()
			}
		},

	    remove: function() {
	        game.scene.removeObject(this);
	        //game.scene.world.removeBody(this.body);
	        game.scene.Box2Dworld.DestroyBody(this.body);
	        game.scene.stage.removeChild(this);
	    }
	});
	
	game.createClass('Panda', 'Sprite', {
		
		init: function(x, y) {

			this._super('panda.png', x, y, {anchor: { x: 0.5, y: 0.5 }});
			game.scene.addObject(this);
			this.addTo(game.scene.stage);

			//create a body using a body definition
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(this.position.x + this.width / 2) * game.Box2D.SCALE,
				(this.position.y + this.height / 2) * game.Box2D.SCALE
			); 
			bodyDef.type = game.Box2D.Body.b2_dynamicBody;	//type is dynamicBody now!
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			//and the fixture
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.CircleShape(this.width / 2 * game.Box2D.SCALE); //the radius of the bubble
			//The following features add some extra juice to our bubble so it will respond in a more realistic way
			fixtureDef.density = 1;		//density has influence on collisions
			fixtureDef.friction = 0.5;		//A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
			fixtureDef.restitution = 0.9;	//=Bounciness (range: 0-1).
			this.body.CreateFixture(fixtureDef);
		},
		
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot
			var p = this.body.GetPosition();
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			this.rotation = this.body.GetAngle().round(2);

			if(game.keyboard.down("UP")){
				this.body.ApplyForce( new  game.Box2D.Vec2(0, -2000), this.body.GetPosition());
			}
			if(game.keyboard.down("DOWN")){
				this.body.ApplyForce( new  game.Box2D.Vec2(0, 2000), this.body.GetPosition());
			}
			if(game.keyboard.down("LEFT")){
				this.body.ApplyForce( new  game.Box2D.Vec2(-2000, 0), this.body.GetPosition());
			}
			if(game.keyboard.down("RIGHT")){
				this.body.ApplyForce( new  game.Box2D.Vec2(2000, 0), this.body.GetPosition());
			}


		}
		
	});

	//========== Button class ==========
	game.createClass('ButtonMove', 'Sprite', {
	    interactive: true,
	
	    init: function(x, y, text, fontsize, click, sender, moves) {
			//call parent conmstructor function
	        this._super('button1a.png', x, y);
	        this.anchor.set(0.5, 0.5);
	        this.position={x:x+this.width/2, y:y+this.height/2};
	        this.moves = moves;
	        this.main = sender;
	        
	        game.scene.stage.addChild(this);

	        //text
	        this.fontsize=fontsize;
            this.text = new game.PIXI.Text(text, { font: this.fontsize.toString()+'px Arial' });
            this.text.position.x=-this.text.width/2;
            this.text.position.y=-this.text.height/2;
            this.addChild(this.text);
            //game.scene.stage.addChild(text);
            
			if(click!==undefined){
				if(sender===undefined){
					sender=this;
				}
				this.click=click.bind(sender);
			}

	    },
	
	    mouseover: function() {
	        this.setTexture("button1b.png");
	        this.text.setStyle({ font: this.fontsize.toString()+'px Arial', fill: "#ffffff" });
	    },

	    mouseout: function() {
	        this.setTexture("button1a.png");
	        this.text.setStyle({ font: this.fontsize.toString()+'px Arial', fill: "#000000" });
	    },
	    tap: function() {
			this.click();
	    }

	});
	//========== Button class ==========
	game.createClass('ButtonNumber', 'Sprite', {
	    interactive: true,
	
	    init: function(x, y, text, fontsize, click, sender, moves) {
			//call parent conmstructor function
	        this._super('button1a.png', x, y);
	        this.anchor.set(0.5, 0.5);
	        this.position={x:x+this.width/2, y:y+this.height/2};
	        this.moves = moves;
	        this.main = sender;
	        
	        game.scene.stage.addChild(this);

	        //text
	        this.fontsize=fontsize;
            this.text = new game.PIXI.Text(text, { font: this.fontsize.toString()+'px Arial' });
            this.text.position.x=-this.text.width/2;
            this.text.position.y=-this.text.height/2;
            this.addChild(this.text);
            //game.scene.stage.addChild(text);
            
			if(click!==undefined){
				if(sender===undefined){
					sender=this;
				}
				this.click=click.bind(sender,text);
				//this.tap=click.bind(sender,text);
			}

	    },
	
	    mouseover: function() {
	        this.setTexture("button1b.png");
	        this.text.setStyle({ font: this.fontsize.toString()+'px Arial', fill: "#ffffff" });
	    },

	    mouseout: function() {
	        this.setTexture("button1a.png");
	        this.text.setStyle({ font: this.fontsize.toString()+'px Arial', fill: "#000000" });
	    },
	    tap: function() {
			this.click();
	    },
	    remove: function() {
	        game.scene.removeObject(this);
	        //game.scene.world.removeBody(this.body);
	        game.scene.Box2Dworld.DestroyBody(this.body);
	        game.scene.stage.removeChild(this);
	    }

	});
/**
	game.createClass('ButtonLeft', 'Sprite', {
	    interactive: true,
	
	    init: function(x, y, text, fontsize, click, sender) {
			//call parent conmstructor function
	        this._super('button1a.png', x, y);
	        this.anchor.set(0.5, 0.5);
	        this.position={x:x+this.width/2, y:y+this.height/2};
	        
	        
	        game.scene.stage.addChild(this);

	        //text
	        this.fontsize=fontsize;
            this.text = new game.PIXI.Text(text, { font: this.fontsize.toString()+'px Arial' });
            this.text.position.x=-this.text.width/2;
            this.text.position.y=-this.text.height/2;
            this.addChild(this.text);
            //game.scene.stage.addChild(text);
            
			if(click!==undefined){
				if(sender===undefined){
					sender=this;
				}
				this.click=click.bind(sender);
			}
	    },
	
	    mouseover: function() {
	        this.setTexture("button1b.png");
	        this.text.setStyle({ font: this.fontsize.toString()+'px Arial', fill: "#ffffff" });
	    },

	    mouseout: function() {
	        this.setTexture("button1a.png");
	        this.text.setStyle({ font: this.fontsize.toString()+'px Arial', fill: "#000000" });
	    }
	});
**/

	game.createClass('Trash', 'Sprite', {
		
		init: function(x, y, main, sprite, x_trash) {
			var starting = true;
			this._super(sprite, x, y, {anchor: { x: 0.5, y: 0.5 }});
			game.scene.addObject(this);
			this.addTo(game.scene.stage);

			this.x_trash = x_trash;
			this.main = main;

			//create a body using a body definition
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(this.position.x + this.width / 2) * game.Box2D.SCALE,
				(this.position.y + this.height / 2) * game.Box2D.SCALE
			); 
			bodyDef.type = game.Box2D.Body.b2_dynamicBody;	//type is dynamicBody now!
			this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
			//and the fixture
			var fixtureDef = new game.Box2D.FixtureDef;
			fixtureDef.shape = new game.Box2D.CircleShape(this.width / 4 * game.Box2D.SCALE); //the radius of the bubble
			//The following features add some extra juice to our bubble so it will respond in a more realistic way
			fixtureDef.density = 1;		//density has influence on collisions
			fixtureDef.friction = 0.5;		//A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
			fixtureDef.restitution = 0.9;	//=Bounciness (range: 0-1).
			this.body.CreateFixture(fixtureDef);
		},
		
		update: function(){
			//The box2D world keeps track of the movement and position of the body.
			//use the update function to get the sprite in the right spot

			var p = this.body.GetPosition();
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			this.rotation = this.body.GetAngle().round(2);
			//console.log("p.x ",p.x, " || this.x_trash ", this.x_trash, "" )
			/*
			if(p.x>0){
						this.main.basuraCorrecta(10);
				this.remove();
				this.main.createTrash();
			}
			*/
			if(p.y > 54){
				if (p.x < 16) {
					// entra en el tarro 1
					if (this.x_trash == 1) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}else if (p.x < 29) {
					// entra en el tarro 2
					if (this.x_trash == 2) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}else if (p.x < 41) {
					// entra en el tarro 3
					if (this.x_trash == 3) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}else if (p.x < 53) {
					// entra en el tarro 4
					if (this.x_trash == 4) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}else if (p.x < 66) {
					// entra en el tarro 5
					if (this.x_trash == 5) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}else if (p.x < 78) {
					// entra en el tarro 6
					if (this.x_trash == 6) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}else if (p.x < 89) {
					// entra en el tarro 7
					if (this.x_trash == 7) {
						this.main.basuraCorrecta(10);
					} else {
						this.main.basuraIncorrecta(-5);
					}
				}
				this.remove();
				this.main.createTrash();
			}
		},
	    remove: function() {
	        game.scene.removeObject(this);
	        //game.scene.world.removeBody(this.body);
	        game.scene.Box2Dworld.DestroyBody(this.body);
	        game.scene.stage.removeChild(this);
	    },
		applyForce: function(moves){
			this.body.ApplyForce( new  game.Box2D.Vec2(moves, 0), this.body.GetPosition());
		}
		
	});
	
	
	game.createScene('Main', {
		backgroundColor: 0xe1d4a7,
		
		init: function() {
			this.dni = "";
			this.cantBasura = 0;
            this.points = 0;
            this.maxBasura = 1;
            var t = document.getElementById("token");
            if (t) {
				this.token = t.value;
            	this.login();
            } else {
            	alert("Falla de seguridad en la conexión con el servidor.");
            	game.system.pause();
            }
            //this.escenario();
		},
		login: function(){
			//backgound images
	        //var logo = new game.Sprite('logo.png').center().addTo(this.stage);
	        var bg = new game.Container().addTo(game.scene.stage);
	        var background = new game.Sprite('basura/fondo.png').addTo(this.stage);
			background.position.set(500*game.scale, 500*game.scale); // Place the background in the centre of the screen
			background.anchor.set(0.5, 0.5); // Set the anchor point to the centre
			background.scale.set(1.7, 1.7); // Set the anchor point to the centre
			bg.addChild(background); // Add the background to the bg container
	        
			
			//create gravity vector
			var gravity = new game.Box2D.Vec2( 0, 0 );// gravity pull x, y
			//and now create world
			this.Box2Dworld = new game.Box2D.World(gravity, false);

			this.buttonNumber1 = new game.ButtonNumber(100, 250, "1", 45, this.number, this);
			this.buttonNumber2 = new game.ButtonNumber(400, 250, "2", 45, this.number, this);
			this.buttonNumber3 = new game.ButtonNumber(700, 250, "3", 45, this.number, this);
			this.buttonNumber4 = new game.ButtonNumber(100, 350, "4", 45, this.number, this);
			this.buttonNumber5 = new game.ButtonNumber(400, 350, "5", 45, this.number, this);
			this.buttonNumber6 = new game.ButtonNumber(700, 350, "6", 45, this.number, this);
			this.buttonNumber7 = new game.ButtonNumber(100, 450, "7", 45, this.number, this);
			this.buttonNumber8 = new game.ButtonNumber(400, 450, "8", 45, this.number, this);
			this.buttonNumber9 = new game.ButtonNumber(700, 450, "9", 45, this.number, this);
			this.buttonNumber0 = new game.ButtonNumber(400, 550, "0", 45, this.number, this);

			this.buttonNumberIngresar = new game.ButtonNumber(700, 550, "Ingresar", 45, this.number, this);
			this.buttonNumberBorrar = new game.ButtonNumber(100, 550, "Borrar", 45, this.number, this);

            this.dniLayer = new game.PIXI.Text(this.dni, { font: '60px Arial', fill: "#ffffff" });
            this.dniLayer.position.x=100;
            this.dniLayer.position.y=200;
            this.stage.addChild(this.dniLayer);

            var dato = new game.PIXI.Text("Ingresa tu DNI:", { font: '60px Arial', fill: "#000000" });
            dato.position.x=100;
            dato.position.y=80;
            this.stage.addChild(dato);

		},
		number: function(n){
			//console.log(n);
			if (n.localeCompare("Borrar") == 0) {
				this.dni = "";
			} else if (n.localeCompare("Ingresar") == 0) {
				//ingresar
				this.stage.removeChild(this.buttonNumber1);
				this.stage.removeChild(this.buttonNumber2);
				this.stage.removeChild(this.buttonNumber3);
				this.stage.removeChild(this.buttonNumber4);
				this.stage.removeChild(this.buttonNumber5);
				this.stage.removeChild(this.buttonNumber6);
				this.stage.removeChild(this.buttonNumber7);
				this.stage.removeChild(this.buttonNumber8);
				this.stage.removeChild(this.buttonNumber9);
				this.stage.removeChild(this.buttonNumber0);
				this.stage.removeChild(this.buttonNumberIngresar);
				this.stage.removeChild(this.buttonNumberBorrar);
				this.escenario();
			} else {
				if (this.dni.length < 8)
				this.dni += n;
            }
            this.stage.removeChild(this.dniLayer);
            this.dniLayer = new game.PIXI.Text(this.dni, { font: '80px Arial', fill: "#ffffff" });
            this.dniLayer.position.x=300;
            this.dniLayer.position.y=150;
            this.stage.addChild(this.dniLayer);
		},
		escenario: function(){

            this.stage.removeChild(this.dniLayer);
			//backgound images
	        //var logo = new game.Sprite('logo.png').center().addTo(this.stage);
	        var bg = new game.Container().addTo(game.scene.stage);
	        var background = new game.Sprite('basura/fondo.png').addTo(this.stage);
			background.position.set(500*game.scale, 500*game.scale); // Place the background in the centre of the screen
			background.anchor.set(0.5, 0.5); // Set the anchor point to the centre
			background.scale.set(1.7, 1.7); // Set the anchor point to the centre
			bg.addChild(background); // Add the background to the bg container
	        
	        //rodillo
	        var rod = new game.Animation(
			    'media/rodillo0001.png',
			    'media/rodillo0002.png',
			    'media/rodillo0003.png',
			    'media/rodillo0004.png',
			    'media/rodillo0005.png'
			);
 
			rod.animationSpeed = 0.4;
			rod.position.set(-50, 0);
	        this.stage.addChild(rod);
	        rod.play();

	        

	        var plataforma = new game.Sprite('basura/plataforma.png').addTo(this.stage);
			plataforma.position.set(500*game.scale, game.system.height*game.scale - 375); // Place the background in the centre of the screen
			plataforma.anchor.set(0.5, 0.5); // Set the anchor point to the centre
			plataforma.scale.set(1.3, 1.3); // Set the anchor point to the centre
			bg.addChild(plataforma); // Add the background to the bg container

			
			//create gravity vector
			var gravity = new game.Box2D.Vec2( 0, 100 * game.Box2D.SCALE );// gravity pull x, y
			//and now create world
			this.Box2Dworld = new game.Box2D.World(gravity, true);
			
			//add walls 
			var thickness = 10;
			//var wall_top    = new game.Wall( 100,  170, 200,50); 
			var wall_top    = new game.Wall( 0,  0, game.system.width,  thickness); 
			var wall_left   = new game.Wall( 0, thickness, thickness,  game.system.height - 2 * thickness);
			var wall_right  = new game.Wall( game.system.width - thickness, thickness, thickness,  game.system.height - 2 * thickness);
			var wall_bottom = new game.Wall( 0,  game.system.height - thickness, game.system.width,  thickness); 
			
			//cinta
			var wall_cinta = new game.Cinta( 0,  game.system.height / 5, game.system.width/3,  thickness); 

			//plataforma
			var wall_plataforma = new game.Wall2( 0,  game.system.height - 100, game.system.width,  thickness); 
			var eslabon = new game.Eslabon( 0,  120, 300); 
			var eslabon2 = new game.Eslabon2( 0,  120, 300); 

			//tachos
			this.wall_t1 = new game.Wall2( game.system.width * 8/100,  game.system.width * 55/100 , game.system.width/37,  100, 7); 
			this.wall_t2 = new game.Wall2( game.system.width * 20/100,  game.system.width * 55/100 , game.system.width/37,  100, 8); 
			this.wall_t3 = new game.Wall2( game.system.width * 32/100,  game.system.width * 55/100 , game.system.width/37,  100, 9); 
			this.wall_t4 = new game.Wall2( game.system.width * 43/100,  game.system.width * 55/100 , game.system.width/37,  100, 10); 
			this.wall_t5 = new game.Wall2( game.system.width * 55/100,  game.system.width * 55/100 , game.system.width/37,  100, 11); 
			this.wall_t6 = new game.Wall2( game.system.width * 67/100,  game.system.width * 55/100 , game.system.width/37,  100, 12); 
			this.wall_t7 = new game.Wall2( game.system.width * 79/100,  game.system.width * 55/100 , game.system.width/37,  100, 13); 
			this.wall_t8 = new game.Wall2( game.system.width * 91/100,  game.system.width * 55/100 , game.system.width/37,  100, 14); 

			//botones
			this.buttonDerecha = new game.ButtonMove(20, 250, "<", 45, this.toLeft, this);
			this.buttonIzquierda = new game.ButtonMove(game.system.width-260, 250, ">", 45, this.toRight, this);
			this.buttonDerechaDoble = new game.ButtonMove(20, 350, "<<", 45, this.toLeftDouble, this);
			this.buttonIzquierdaDoble = new game.ButtonMove(game.system.width-260, 350, ">>", 45, this.toRightDouble, this);
/*
			//add a couple of bubbles
			for(var i=0; i<25; i++){
				var bubble1 = new game.Bubble( Math.random()*(game.system.width-200) + 100, Math.random()*250 + 100);
			}
*/			
			this.actualizarLayer();
			//var panda = new game.Panda(300,300);
			this.createTrash();

            var text = new game.PIXI.Text("Por qué los tarros no tienen un color?", { font: '20px Arial' });
            text.position.x=145;
            text.position.y=690;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("Nuestros gobernantes no se preocupan por los residuos y \npor ende nunca definieron un estandar de colores único.", { font: '20px Arial' });
            text.position.x=145;
            text.position.y=715;
            this.stage.addChild(text);

            this.pointsLayer = new game.PIXI.Text(this.points, { font: '60px Arial', fill: "#ffffff" });
            this.pointsLayer.position.x=842;
            this.pointsLayer.position.y=15;
            this.stage.addChild(this.pointsLayer);

            

            /**
			var plataforma_front = new game.Sprite('basura/plataforma_front.png').addTo(this.stage);
			plataforma_front.position.set(500*game.scale, game.system.height*game.scale - 375); // Place the background in the centre of the screen
			plataforma_front.anchor.set(0.5, 0.5); // Set the anchor point to the centre
			plataforma_front.scale.set(1.3, 1.3); // Set the anchor point to the centre
			bg.addChild(plataforma_front); // Add the background to the bg container
**/
			//this.plataforma_front = new game.PlataformaFront( 1000*game.scale,  game.system.height*game.scale + 125); 


		},
		update: function(){
			this._super();
			//The following code is needed to update the time in the box2d world.
			//The values below are fine as default values, feel free to look up more info in the reference.
			this.Box2Dworld.Step(
				game.system.delta, //time elapsed
				6,	//world Velocity Iterations
				6	//world Position Iterations				
			);
			this.Box2Dworld.ClearForces();	//The world has been updated. Now get rid of forces that had been set during the previous cicle.

		},
         
		sort: function() {
			//All sprites have been added to game.scene.stage.
			//In order to update the zIndex, you have to sort the following list
			game.scene.stage.children.sort(this.depthCompare);
		},

        finish: function(){
        	//game.system.pause();
        	//document.getElementById("finish").submit();
		    
		    this.result = "";

/*
		    $.post("finish.php",
		    {
		        dni: this.dni,
		        puntos: this.points,
		        token: this.token
		    },
		    function(data, status){
		        //alert("Data: " + data + "\nStatus: " + status);
		        this.result = data;
		    });
*/
/*
			$.ajax({
				type: 'POST',
				url: "finish.php",
				data: {
			        dni: this.dni,
			        puntos: this.points,
			        token: this.token
		    	},
				success: function(result) {
					this.result = data;
				},
				dataType: "html",
				async:false
			});*/
//var result = $.ajax({url: "finish.php", data: {dni: this.dni,puntos: this.points,token: this.token}, async: false}).responseText;
/*
var jqxhr = $.post("finish.php",
		    {
		        dni: this.dni,
		        puntos: this.points,
		        token: this.token
		    },
		    function(data, status){
		        alert("Data: " + data + "\nStatus: " + status);
		        this.result = data;
		    })
  .fail(function() {
    this.result = "ERROR";
  });*/
			this.sendCompleted(function(status, element){
				if (status) {
			        var dato = new game.PIXI.Text("Se ha registrado el juego \ncon puntaje "+element.points+" y DNI "+element.dni+" \nen nuestro servidor.", { font: '60px Arial', fill: "#000000" });
			        dato.position.x=100;
			        dato.position.y=280;
			        element.stage.addChild(dato);
			        setTimeout(function(){
					  location.reload();
					}, 4000);
				} else {
			        var dato = new game.PIXI.Text("Ha ocurrido un error \nal guardar los datos en el servidor.", { font: '55px Arial', fill: "#000000" });
			        dato.position.x=100;
			        dato.position.y=280;
			        element.stage.addChild(dato); 
			        setTimeout(function(){
					  location.reload();
					}, 4000);   
				}
			}, this);

        	//game.system.resume();
			//backgound images
	        //var logo = new game.Sprite('logo.png').center().addTo(this.stage);
	        var bg = new game.Container().addTo(game.scene.stage);
	        var background = new game.Sprite('basura/fondo.png').addTo(this.stage);
			background.position.set(500*game.scale, 500*game.scale); // Place the background in the centre of the screen
			background.anchor.set(0.5, 0.5); // Set the anchor point to the centre
			background.scale.set(1.7, 1.7); // Set the anchor point to the centre
			bg.addChild(background); // Add the background to the bg container
	        
			
			//create gravity vector
			var gravity = new game.Box2D.Vec2( 0, 0 );// gravity pull x, y
			//and now create world
			this.Box2Dworld = new game.Box2D.World(gravity, false);

            var dato = new game.PIXI.Text("Felicitaciones! \nHas completado el nivel.", { font: '60px Arial', fill: "#000000" });
            dato.position.x=100;
            dato.position.y=80;
            this.stage.addChild(dato);

        },


        toRight: function(){
        /*	this.wall_t1.toRight();
        	this.wall_t2.toRight();
        	this.wall_t3.toRight();
        	this.wall_t4.toRight();
        	this.wall_t5.toRight();
        	this.wall_t6.toRight();
        	this.wall_t7.toRight();
        	this.wall_t8.toRight();
        	*/
        //	this.plataforma_front.toRight();
        	this.basura.applyForce(5000);
        },

        toLeft: function(){
        	/*
        	this.wall_t1.toLeft();
        	this.wall_t2.toLeft();
        	this.wall_t3.toLeft();
        	this.wall_t4.toLeft();
        	this.wall_t5.toLeft();
        	this.wall_t6.toLeft();
        	this.wall_t7.toLeft();
        	this.wall_t8.toLeft();
        	*/
        //	this.plataforma_front.toLeft();
        	this.basura.applyForce(-5000);
        },
        toRightDouble: function(){
        	this.basura.applyForce(20000);
        },

        toLeftDouble: function(){
        	this.basura.applyForce(-20000);
        },

        createTrash: function(){
        	if (this.cantBasura == this.maxBasura) {
        		this.finish();
        	} else {
	        	var r = Math.random();
	        	if(r < 0.5){
					this.plataforma_front.remove();
					this.basura = new game.Trash(-20, 0, this, 'basura/banana2.png', 4);
					this.basura.scale.set(0.5,0.5);
					this.actualizarLayer();
				} else {
					this.plataforma_front.remove();
					this.basura = new game.Trash(-20, 0, this, 'basura/banana2.png', 6);
					this.basura.scale.set(0.5,0.5);
					this.actualizarLayer(); 
				}
			}

        	this.cantBasura++;
        },

        actualizarLayer: function(){
			this.plataforma_front = new game.PlataformaFront( 1020*game.scale,  game.system.height*game.scale + 15); 
            var text = new game.PIXI.Text("Vidrio", { font: '20px Arial' });
            text.position.x=140;
            text.position.y=595;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("Cartón", { font: '20px Arial' });
            text.position.x=250;
            text.position.y=595;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("Plástico", { font: '20px Arial' });
            text.position.x=370;
            text.position.y=595;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("Orgánico", { font: '20px Arial' });
            text.position.x=485;
            text.position.y=595;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("Pilas", { font: '20px Arial' });
            text.position.x=625;
            text.position.y=595;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("RAEE", { font: '20px Arial' });
            text.position.x=740;
            text.position.y=595;
            this.stage.addChild(text);
            var text = new game.PIXI.Text("   RAEE \n Reusable", { font: '20px Arial' });
            text.position.x=842;
            text.position.y=578;
            this.stage.addChild(text);
 		},
 		basuraCorrecta: function(points){
 			this.stage.removeChild(this.pointsLayer);
 			this.points += points;
            this.pointsLayer = new game.PIXI.Text(this.points.toString(), { font: '60px Arial' });
	        this.pointsLayer.setStyle({ font: '60px Arial', fill: "#00ff00" });
            this.pointsLayer.position.x=842;
            this.pointsLayer.position.y=15;
            this.stage.addChild(this.pointsLayer);
 		},
 		basuraIncorrecta: function(points){
 			this.stage.removeChild(this.pointsLayer);
 			this.points += points;
            this.pointsLayer = new game.PIXI.Text(this.points.toString(), { font: '60px Arial' });
	        this.pointsLayer.setStyle({ font: '60px Arial', fill: "#ff0000" });
            this.pointsLayer.position.x=842;
            this.pointsLayer.position.y=15;
            this.stage.addChild(this.pointsLayer);
 		},
 		reload: function(){
 			location.reload();
 		},
 		sendCompleted: function(callback, element){
		    $.ajax({
		        type: 'POST',
		        url: "finish.php",
		        data: { 
			        dni: this.dni,
			        puntos: this.points,
			        token: this.token
				},
		        async: true
		    }).done(function (data) {
		    	//if (data.result === true) {
	    		//alert(data);
	    		//alert(data.result);
	    		//alert(element);
				callback(data.search("true") >= 0, element);
				//}
		    }).fail(function (jqXhr, textStatus, errorThrown, element) {
		    	callback(false, element);
		    });
 		}
	});
 
});