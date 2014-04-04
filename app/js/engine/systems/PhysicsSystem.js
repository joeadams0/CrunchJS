/**
 * @author Justin White
 * The formula for accessing methods and properties from box2d were adapted from
 * http://www.jeremyhubble.com/box2d.html
 * The method calls to box2d.js used in PhysicsSystem.js do not exactly match up to 
 * the methods outlined in the above url since the box2d versions used differ between the url
 * and this project.
 */

goog.provide('CrunchJS.Systems.PhysicsSystem');
goog.require('box2d.World');
goog.require('CrunchJS.System');
goog.require('box2d.World');
goog.require('box2d.AABB');
goog.require('box2d.Vec2');
goog.require('box2d.PolyShape');
goog.require('box2d.CircleDef');
goog.require('box2d.BodyDef');

/**
 * Creates the Physics System
 * @extends {CrunchJS.System}
 * @constructor
 * @class Physics System
 */
CrunchJS.Systems.PhysicsSystem = function() {
	goog.base(this);
};

goog.inherits(CrunchJS.Systems.PhysicsSystem, CrunchJS.System);

CrunchJS.Systems.PhysicsSystem.prototype.name = 'PhysicsSystem';

CrunchJS.Systems.PhysicsSystem.prototype.activate = function() {
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

//var canvasw;
// CrunchJS.Systems.PhysicsSystem.prototype = function setcanvaswidth(canvaswidth){
// 	return canvasw = canvaswidth;
// }

// var canvash;
// function setcanvaswidth(canvaswidth){
// 	return canvash = canvaswidth;
// }


/**
 * Initializes world and objects.  Sets regular interval
 */
CrunchJS.Systems.PhysicsSystem.prototype.init = function (){
	
	var worldAABB = new box2d.AABB();
	worldAABB.minVertex.Set(-1000, -1000);
	worldAABB.maxVertex.Set(1000, 1000);
	var gravity = new box2d.Vec2(0, 0);
	var doSleep = true;
	var world = new box2d.World(worldAABB, gravity, doSleep);	
	return world;

	//This will be called from the scene not from the init() function
	/**
	 * Calls update() method repeatedly at the rate indiciated by the int passed into the method
	 * @type {int}
	 */
	//window.setInterval(update(world), (1000/50));
};



 /**
 * Helper method to get collisions that have happened during that step
 */
//b is linked list of bodies in world
CrunchJS.Systems.PhysicsSystem.prototype.collisionCollect = function (b){
	var edge = b.box2d.GetContactList();
	return edge;
	//can iterate over edges to evaluate the collisions that happened
};


/**
 * main function
 * called at the regular interval as defined in init()
 * edits the transform component once an object moves after a step()
 */
CrunchJS.Systems.PhysicsSystem.prototype.update = function (world){

	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	var b = world.getBodyList;
	var listCollisions = this.collisionCollect(b);
};
//TO DO: Have to adjust how vertexes are added to Box2D world
/**
 * Adds rectangle to Box2D simulation
 * Sets width, height, mass, and placement of object
 * Creates object in Box2D world
 * @param {int} canvaswidth
 * @param {int} canvasheight
 */
// CrunchJS.Systems.PhysicsSystem.prototype = function addRectangle(canvaswidth, canvasheight, world){
// 	//create rectangle
// 	var canvaswidth = 100;
// 	var canvasheight = 100;
// 	var bodyDef = new box2d.BodyDef();
// 	bodyDef.type = box2d.b2Body.b2_dynamicBody;
// 	var scale = 30;
// 	
////fixDef() doesnt exist in this version of box2D we are using
//
// 	bodyDef.position.x = (canvaswidth - scale*2)*Math.random()+scale*2;
// 	bodyDef.position.y = canvasheight - (scale*Math.random() +scale);
// 	world.CreateBody(bodyDef).CreateFixture(fixDef);
// };


CrunchJS.Systems.PhysicsSystem.prototype.addCircle = function (radius, world){
	var circleSd = new box2d.CircleDef();
	circleSd.density = 1.0;
	circleSd.radius = radius;
	circleSd.restitution = 1.0;
	circleSd.friction = 0;
	var circleBd = new box2d.BodyDef();
	circleBd.AddShape(circleSd);
	circleBd.position.Set(50,50);
	var circleBody = world.CreateBody(circleBd);
};

/**
 * Adds force to objectID over time
 * @param  {String} objectID id of object
 * @param  {int} degree    angle of force to be applied
 * @param  {int} power     magnitude of the force
 */
CrunchJS.Systems.PhysicsSystem.prototype.addForce = function (objectID, degree, power){
	var body = this.bodiesMap[objectID];
	body.ApplyForce(new box2d.Vec2(Math.cos(degree * (Math.PI / 180)) * power,
        Math.sin(degree * (Math.PI / 180)) * power),
        body.GetWorldCenter());
};

/**
 * Adds force to objectID within in physics simulation
 *
 * ApplyImpulse method signiture from Box2D file
 * box2d.Body.prototype.ApplyImpulse = function(impulse, point)
 * 
 * @param {int} objectID Entity
 * @param {vector} v is a vector composed of x and y components representing velocity in each direction
 */
CrunchJS.Systems.PhysicsSystem.prototype.addImpulse = function (objectID, degree, power){
	var body = this.bodiesMap[objectID];
    body.ApplyImpulse(new box2d.Vec2(Math.cos(degree * (Math.PI / 180)) * power,
        Math.sin(degree * (Math.PI / 180)) * power),
        body.GetWorldCenter());
};

/**
 * Stops the execution of the setInterval
 * @param  {int} intervalVariable global variable set by initial setInterval() call
 */
CrunchJS.Systems.PhysicsSystem.prototype.cancelUpdate = function (intervalVariable){
	window.clearInterval(intervalVariable);
};