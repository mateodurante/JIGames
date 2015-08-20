game.module(
    'plugins.physicsextend'
)
.require(
    'engine.physics'
).body(function() {
    
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Stephan Vermeire
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



game.CollisionSolver.inject({
/**
    Hit response a versus b.
    @method hitResponse
    @param {game.Body} a
    @param {game.Body} b
    @return {Boolean}
**/
	hitResponse : function(a, b) {
    //Execute the collide function of body a to let the object know that a collision occured.
    //The response of the function tells us wether we should perform a hit response.

	    if (a.collide(b)) {
	        if (a.fixed && b.fixed) return true; //Both wallShapes. No hitresponse need to be dealt with
	        var restitution = Math.sqrt(a.restitution * b.restitution) * 1.006;
	        if (a.fixed || b.fixed) {
	            //body<=>wall collision. The speed of the non-wall body changes only.
	            var wall, ball;
	            if (a.fixed) {
	                wall = a;
	                ball = b;
	            } else {
	                wall = b;
	                ball = a;
	            }
	            //calculate the current distance of the wall/body and also estimate of the distance that they will just touch each other
	            var distanceBW = new game.Vector().copy(ball.position).subtract(wall.position);
	            var distanceTouch = new game.Vector();
	            if (wall.shape instanceof game.Rectangle) distanceTouch.add(wall.shape.width / 2, wall.shape.height / 2);
	            else if (wall.shape instanceof game.Circle) distanceTouch.add(wall.shape.radius);
	            else return true;
	            if (ball.shape instanceof game.Rectangle) distanceTouch.add(ball.shape.width / 2, ball.shape.height / 2);
	            else if (ball.shape instanceof game.Circle) distanceTouch.add(ball.shape.radius);
	            else return true;
	
	            //calulate the absolute width + height of the overlap square
	            var overlap = new game.Vector(
	                Math.abs(Math.abs(distanceTouch.x) - Math.abs(distanceBW.x)),
	                Math.abs(Math.abs(distanceTouch.y) - Math.abs(distanceBW.y))
	            );
	
	            //execute collision
	            if (overlap.x > overlap.y) {
	                if (ball.velocity.y > 0 && distanceBW.y < 0) {
	                    //TOP bounce
	                    ball.velocity.x *= restitution;
	                    ball.velocity.y *= -1 * restitution;
	                    ball.position.y -= overlap.y;
	                } else if (ball.velocity.y < 0 && distanceBW.y >= 0) {
	                    //BOTTOM bounce
	                    ball.velocity.x *= restitution;
	                    ball.velocity.y *= -1 * restitution;
	                    ball.position.y += overlap.y;
	                }
	            } else {
	                if (ball.velocity.x > 0 && distanceBW.x < 0) {
	                    //LEFT bounce
	                    ball.velocity.x *= -1 * restitution;
	                    ball.velocity.y *= restitution;
	                    ball.position.x -= overlap.x;
	                } else if (ball.velocity.x < 0 && distanceBW.x >= 0) {
	                    //RIGHT bounce
	                    ball.velocity.x *= -1 * restitution;
	                    ball.velocity.y *= restitution;
	                    ball.position.x += overlap.x;
	                }
	            }
	            return true;
	        }
	
	        //Collision between two normal bodies
	        //prepare masses
	        var a_mass = a.mass;
	        var b_mass = b.mass;
	        if (a_mass == 0) {
	            a_mass = 0.001;
	        }
	        if (b_mass == 0) {
	            b_mass = 0.001;
	        }
	
	        //circles
	        if (a.shape instanceof game.Circle && b.shape instanceof game.Circle) {
	
	            var posA = new game.Vector().copy(a.position);
	            var velA = new game.Vector().copy(a.velocity);
	            var posB = new game.Vector().copy(b.position);
	            var velB = new game.Vector().copy(b.velocity);
	            var baseAngle = posA.angle(posB);
	
	            //rotate
	            velA.rotate(-baseAngle);
	            velB.rotate(-baseAngle);
	
	            //A en B
	
	            if (velA.x - velB.x > 0) {
	                var vAxNew = (velA.x * (a_mass - b_mass) + 2 * b_mass * velB.x) / (a_mass + b_mass);
	                var vBxNew = (velB.x * (a_mass - b_mass) + 2 * b_mass * velA.x) / (a_mass + b_mass);
	
	                velA.x = vAxNew * restitution;
	                velB.x = vBxNew * restitution;
	                a.velocity = velA.rotate(baseAngle);
	                b.velocity = velB.rotate(baseAngle);
	            }
	            this.seperateBodies(a, b);
	            return true;
	        }
	
	        //calculate an impulse vector based on velocity and mass of each body
	        var distanceAB = new game.Vector().copy(b.position).subtract(a.position);
	        var velocityAB = new game.Vector().copy(b.velocity).subtract(a.velocity);
	        //is distance decreasing? Then take some action
	        var dDistance = new game.Vector().copy(distanceAB).multiply(velocityAB);
	        if (dDistance.x < 0) {
	            //execute impuls
	            var avx = a.velocity.x;
	            var bvx = b.velocity.x;
	            a.velocity.x = (avx * (a_mass - b_mass) + 2 * b_mass * bvx) / (a_mass + b_mass) * restitution;
	            b.velocity.x = (bvx * (b_mass - a_mass) + 2 * a_mass * avx) / (a_mass + b_mass) * restitution;
	        }
	        if (dDistance.y < 0) {
	            //execute impuls
	            var avy = a.velocity.y;
	            var bvy = b.velocity.y;
	            a.velocity.y = (avy * (a_mass - b_mass) + 2 * b_mass * bvy) / (a_mass + b_mass) * restitution;
	            b.velocity.y = (bvy * (b_mass - a_mass) + 2 * a_mass * avy) / (a_mass + b_mass) * restitution;
	        }
	        this.seperateBodies(a, b);
	        return true;
	    }
	    return false;
	},
	
	/**
	    Seperate bodies a and b from each other.
	    @method seperateBodies
	    @param {game.Body} a
	    @param {game.Body} b
	**/
	seperateBodies : function(a, b) {
	    var distanceBW = new game.Vector().copy(b.position).subtract(a.position),
	        distanceTouch = new game.Vector(),
	        overlap;
	
	    if (a.shape instanceof game.Circle && b.shape instanceof game.Circle) {
	        // circle <=> circle
	        distanceTouch = a.shape.radius + b.shape.radius;
	        overlap = new game.Vector().copy(distanceBW).multiply(1 - distanceBW.length() / distanceTouch);
	        a.position.x -= overlap.x / 2;
	        a.position.y -= overlap.y / 2;
	        b.position.x += overlap.x / 2;
	        b.position.y += overlap.y / 2;
	        return;
	    }
	
	    // circle/square <=> circle/square
	    if (a.shape instanceof game.Rectangle) distanceTouch.add(a.shape.width / 2, a.shape.height / 2);
	    else if (a.shape instanceof game.Circle) distanceTouch.add(a.shape.radius);
	    else return;
	    if (b.shape instanceof game.Rectangle) distanceTouch.add(b.shape.width / 2, b.shape.height / 2);
	    else if (b.shape instanceof game.Circle) distanceTouch.add(b.shape.radius);
	    else return;
	
	    distanceBW = new game.Vector().copy(b.position).subtract(a.position);
	    overlap = {
	        x: Math.abs(Math.abs(distanceTouch.x) - Math.abs(distanceBW.x)),
	        y: Math.abs(Math.abs(distanceTouch.y) - Math.abs(distanceBW.y))
	    };
	    if (overlap.x > overlap.y) {
	        if (a.y < b.y) {
	            a.position.y -= overlap.y / 2;
	            b.position.y += overlap.y / 2;
	        } else {
	            a.position.y += overlap.y / 2;
	            b.position.y -= overlap.y / 2;
	        }
	    } else {
	        if (a.x < b.x) {
	            a.position.x -= overlap.x / 2;
	            b.position.x += overlap.x / 2;
	        } else {
	            a.position.x += overlap.x / 2;
	            b.position.x -= overlap.x / 2;
	        }
	    }
	}
});


game.Body.inject({
    /**
    Fixation of body (which makes it acts like a wall).
    @property {Bool} fixed
    @default false
    **/
    fixed: false,
    /**
        Factor of the global gravity that affects this body.
        @property {Number} gravityFactor
        @default 1
    **/
    gravityFactor: 1,
    /**
        Restitution (or bounciness) factor of this body when it collides with another body.
        @property {Number} restitution
        @default 1
    **/
    restitution: 1,

	/**
	    @method update
	**/
	update: function() {
	    if(this.fixed) return;
	    this.last.copy(this.position);
	
	    if (this.mass > 0 && this.gravityFactor > 0) {
	        this.velocity.x += this.world.gravity.x * this.gravityFactor * game.system.delta;
	        this.velocity.y += this.world.gravity.y * this.gravityFactor * game.system.delta;
	        this.velocity.limit(this.velocityLimit);
	    }
	
	    this.position.multiplyAdd(this.velocity, game.scale * game.system.delta);
	}

});



});