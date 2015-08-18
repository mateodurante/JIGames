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

			//That's it! We don't have to add it to the world anymore because that is dealt with during the construction proces already.

			game.scene.addObject(this);
		},
		
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
				game.system.width * 9/100,
				game.system.width * 21/100,
				game.system.width * 33/100,
				game.system.width * 45/100,
				game.system.width * 57/100,
				game.system.width * 69/100,
				game.system.width * 80/100,
				game.system.width * 93/100
			]
			/**
			//draw shapes. This is done for demonstration purposes only so you know where the walls are.
			this.position = {x: x, y: y};
            //set linestyle and draw rectangle
            this.lineStyle (2, 0x7c2f01);
            this.beginFill(0xda633e, 1);
            this.drawRect(0, -50, width, height);
            this.endFill();
            this.drawRect(0, -50, width, height);   //x, y, width, height
			this.addTo(game.scene.stage);
**/
			//create body definition (the 'blueprint'for the actual body).
		    var bodyDef = new game.Box2D.BodyDef();
			bodyDef.position = new game.Box2D.Vec2(
				(x + width / 2) * game.Box2D.SCALE,
				(y + height / 2) * game.Box2D.SCALE
			); 

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
			//var p = {x : x, y : y};
			this.position.x = p.x / game.Box2D.SCALE;
			this.position.y = p.y / game.Box2D.SCALE;
			//stops when is on right position
			if (this.position.x > this.positionsX[this.basePos]) {
				this.body.m_linearVelocity.x = -6;
				this.stopped = true;
			}
			if (this.position.x < this.positionsX[this.basePos]) {
				this.body.m_linearVelocity.x = 6;
				this.stopped = true;
			}

		},
		
		toRight: function(){
			if (this.basePos < 7 && this.stopped) {
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
	game.createClass('ButtonRight', 'Sprite', {
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


	game.createClass('Banana', 'Sprite', {
		
		init: function(x, y) {
			var starting = true;
			this._super('basura/banana2.png', x, y, {anchor: { x: 0.5, y: 0.5 }});
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
			if (this.position.x < game.system.width/3) {
				this.body.ApplyForce( new  game.Box2D.Vec2(200, 0), this.body.GetPosition());
//				console.log(p.x /  game.Box2D.SCALE);
			} else {
				this.body.ApplyForce( new  game.Box2D.Vec2(-200, 0), this.body.GetPosition());
			}
			this.rotation = this.body.GetAngle().round(2);

		}
		
	});
	
	
	game.createScene('Main', {
		backgroundColor: 0xe1d4a7,
		
		init: function() {
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
			var wall_plataforma = new game.Wall( 0,  game.system.height - 100, game.system.width,  thickness); 

			//tachos
			this.wall_t1 = new game.Wall2( game.system.width * 21/100,  game.system.width * 55/100 , game.system.width/90,  100, 0); 
			this.wall_t2 = new game.Wall2( game.system.width * 33/100,  game.system.width * 55/100 , game.system.width/90,  100, 1); 
			this.wall_t3 = new game.Wall2( game.system.width * 45/100,  game.system.width * 55/100 , game.system.width/90,  100, 2); 
			this.wall_t4 = new game.Wall2( game.system.width * 57/100,  game.system.width * 55/100 , game.system.width/90,  100, 3); 
			this.wall_t5 = new game.Wall2( game.system.width * 69/100,  game.system.width * 55/100 , game.system.width/90,  100, 4); 
			this.wall_t6 = new game.Wall2( game.system.width * 80/100,  game.system.width * 55/100 , game.system.width/90,  100, 5); 
			this.wall_t7 = new game.Wall2( game.system.width * 80/100,  game.system.width * 55/100 , game.system.width/90,  100, 6); 
			this.wall_t8 = new game.Wall2( game.system.width * 80/100,  game.system.width * 55/100 , game.system.width/90,  100, 7); 

			//botones
			this.buttonDerecha = new game.ButtonRight(0, 300, "<<", 45, this.toLeft, this);
			this.buttonIzquierda = new game.ButtonLeft(game.system.width-300, 300, ">>", 45, this.toRight, this);

			//add a couple of bubbles
			for(var i=0; i<25; i++){
				var bubble1 = new game.Bubble( Math.random()*(game.system.width-200) + 100, Math.random()*250 + 100);
			}
			
			var panda = new game.Panda(300,300);
			var banana = new game.Banana(0, 0);
			banana.scale.set(0.5,0.5)

            var text = new game.PIXI.Text("Apreta las flechitas amegx", { font: '20px Arial' });
            text.position.x=15;
            text.position.y=15;
            this.stage.addChild(text);
            /**
			var plataforma_front = new game.Sprite('basura/plataforma_front.png').addTo(this.stage);
			plataforma_front.position.set(500*game.scale, game.system.height*game.scale - 375); // Place the background in the centre of the screen
			plataforma_front.anchor.set(0.5, 0.5); // Set the anchor point to the centre
			plataforma_front.scale.set(1.3, 1.3); // Set the anchor point to the centre
			bg.addChild(plataforma_front); // Add the background to the bg container
**/
			this.wall_t8 = new game.PlataformaFront( 1020*game.scale,  game.system.height*game.scale + 15); 

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

        toRight: function(){
        	this.wall_t1.toRight();
        	this.wall_t2.toRight();
        	this.wall_t3.toRight();
        	this.wall_t4.toRight();
        	this.wall_t5.toRight();
        	this.wall_t6.toRight();
        	this.wall_t7.toRight();
        	this.wall_t8.toRight();
        },

        toLeft: function(){
        	this.wall_t1.toLeft();
        	this.wall_t2.toLeft();
        	this.wall_t3.toLeft();
        	this.wall_t4.toLeft();
        	this.wall_t5.toLeft();
        	this.wall_t6.toLeft();
        	this.wall_t7.toLeft();
        	this.wall_t8.toLeft();
        }
 
	});
 
});