/**
 * @author Justin White
 */

goog.provide('CrunchJS.Systems.PhysicsSystem');
goog.require('box2d.World');
goog.require('CrunchJS.System');
goog.require('box2d.World');
goog.require('box2d.AABB');
//goog.require('box2d.dynamics');
//goog.require('box2d.Collision.b2AABB');
goog.require('box2d.Vec2');
goog.require('box2d.PolyShape');
goog.require('box2d.CircleDef');
goog.require('box2d.BodyDef');
//goog.require('Moba');
/**
 * Creates the Physics System
 * @extends {CrunchJS.System}
 * @constructor
 * @class Physics System
 */
Moba.PhysicsSystem = function() {
	goog.base(this);
};

goog.inherits(Moba.PhysicsSystem, CrunchJS.System);

Moba.PhysicsSystem.prototype.name = 'PhysicsSystem';

Moba.PhysicsSystem.prototype.activate = function() {
	goog.base(this, 'activate');
	this.setEntityComposition(this.getScene().createEntityComposition().one('ExampleComp', 'ExampleComp1').exclude('ExampleComp'));
};


/**
 *
    var b2AABB = box2d.AABB;
	var worldAABB = new b2AABB();
	var b2Vec2 = box2d.Vec2;
	worldAABB.minVertex.Set(-1000, -1000);
	worldAABB.maxVertex.Set(1000, 1000);
	var gravity = new b2Vec2(0, 0);
	var doSleep = true;
	var world = new box2d.World(worldAABB, gravity, doSleep); 
	console.log(world);
 *
 *
 *
 * 
 */





/**
 * Sets gravity to be having no effect on the world
 * @define {int}
 */
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var gravity = new b2Vec2(0, 0);
/**
 * Allows objects in the world to enter the sleep state.  Sleep state allows for reduction in cpu usage when an object is not being moved.
 * @define {boolean}
 */
var doSleep = true;
/**
 * Declares and initializes the world object used in the Box2D simulation
 * @define {b2World}
 */
var world = new b2World(gravity, doSleep);
/**
 * Deletes an object once it is x pixels off the screen
 * @define {int}
 */
//var deletionBuffer = x;

var canvasw;
Moba.PhysicsSystem.prototype = function setcanvaswidth(canvaswidth){
	return canvasw = canvaswidth;
}

var canvash;
function setcanvaswidth(canvaswidth){
	return canvash = canvaswidth;
}


/**
 * Initializes world and objects.  Sets regular interval
 */
Moba.PhysicsSystem.prototype = function init(){
	//create ground here if needed


	//create any objects that are needed in the scene at first
	addRectangle(canvasw, canvash);
};



*
 * Send notfication of collision event to engine core
 * @param {int} object1 id (entity) of first object involved in collision
 * @param {int} object2 id (entity) of second object involved in collision
 
Moba.PhysicsSystem.prototype = function collisionAlert(object1, object2){
};

/**
 * main function
 * called at the regular interval as defined in init()
 * edits the transform component once an object moves after a step()
 */
Moba.PhysicsSystem.prototype = function update(){
	world.Step(1 / 60, 10, 10);

/**
 * Calls update() method repeatedly at the rate indiciated by the int passed into the method
 * @type {int}
 */
	window.setInterval(update, (1000/50));


};

/**
 * Adds rectangle to Box2D simulation
 * Sets width, height, mass, and placement of object
 * Creates object in Box2D world
 * @param {int} canvaswidth
 * @param {int} canvasheight
 */
Moba.PhysicsSystem.prototype = function addRectangle(canvaswidth, canvasheight, world){
	//create rectangle
	var canvaswidth = 100;
	var canvasheight = 100;
	var bodyDef = new box2d.BodyDef;
	var fixDef = new box2d.FixtureDef;
	box2d.xDef.density = 0.4;
	fixDef.friction = 0.2;
	fixDef.restitution = 0.2;

	bodyDef.type = box2d.b2Body.b2_dynamicBody;
	fixDef.shape = new box2d.b2PolygonShape;
	var scale = 30;
	fixDef.shape.SetAsArray([
		new b2Vec2(scale*0.866 , scale*0.5),
		new b2Vec2(scale*-0.866, scale*0.5),
				new b2Vec2(0, scale*1),
				new b2Vec2(0, scale*-1)
			  	]);
	bodyDef.position.x = (canvaswidth - scale*2)*Math.random()+scale*2;
	bodyDef.position.y = canvasheight - (scale*Math.random() +scale);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
};


Moba.PhysicsSystem.prototype = function addCircle(radius, world){
	var circleSd = new box2d.CircleDef();
	circleSd.density = 1.0;
	circleSd.radius = radius;
	circleSd.restitution = 1.0;
	circleSd.friction = 0;
	var circleBd = new box2d.BodyDef();
	circleBd.AddShape(circleSd);
	circleBd.position.Set(50,50);
	var circleBody = world.CreateBody(circleBd);
}

/**
 * Adds force to objectID within in physics simulation
 *
 * ApplyImpulse method signiture from Box2D file
 * box2d.Body.prototype.ApplyImpulse = function(impulse, point)
 * 
 * @param {int} objectID Entity
 * @param {vector} v is a vector composed of x and y components representing velocity in each direction
 */
Moba.PhysicsSystem.prototype = function addImpulse(objectID, v){

};

/**
 * Stops the execution of the setInterval
 * @param  {int} intervalVariable global variable set by initial setInterval() call
 */
Moba.PhysicsSystem.prototype = function cancelUpdate(intervalVariable){
	window.clearInterval(intervalVariable);
};