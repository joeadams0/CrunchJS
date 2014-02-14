// /**
//  * @author Justin White
//  */

// goog.provide('CrunchJS.Systems.PhysicsSystem');
// goog.require('box2d.World');
// goog.require('CrunchJS.System');
// //goog.require('Moba');
// /**
//  * Creates the Physics System
//  * @extends {CrunchJS.System}
//  * @constructor
//  * @class Physics System
//  */
// Moba.PhysicsSystem = function() {
// 	goog.base(this);
// };

// goog.inherits(Moba.PhysicsSystem, CrunchJS.System);

// Moba.PhysicsSystem.prototype.name = 'PhysicsSystem';

// Moba.PhysicsSystem.prototype.activate = function() {
// 	goog.base(this, 'activate');
// 	this.setEntityComposition(this.getScene().createEntityComposition().one('ExampleComp', 'ExampleComp1').exclude('ExampleComp'));
// };


// /**
//  * Sets gravity to be having no effect on the world
//  * @define {int}
//  */
// var b2Vec2 = Box2D.Common.Math.b2Vec2;
// var gravity = new b2Vec2(0, 0);
// /**
//  * Allows objects in the world to enter the sleep state.  Sleep state allows for reduction in cpu usage when an object is not being moved.
//  * @define {boolean}
//  */
// var doSleep = true;
// /**
//  * Declares and initializes the world object used in the Box2D simulation
//  * @define {b2World}
//  */
// var world = new b2World(gravity, doSleep);
// /**
//  * Deletes an object once it is x pixels off the screen
//  * @define {int}
//  */
// //var deletionBuffer = x;

// var canvasw;
// Moba.PhysicsSystem.prototype = function setcanvaswidth(canvaswidth){
// 	return canvasw = canvaswidth;
// }

// var canvash;
// function setcanvaswidth(canvaswidth){
// 	return canvash = canvaswidth;
// }


// /**
//  * Initializes world and objects.  Sets regular interval
//  */
// Moba.PhysicsSystem.prototype = function init(){
// 	//create ground here if needed


// 	//create any objects that are needed in the scene at first
// 	addRectangle(canvasw, canvash);
// };

// /**
//  * Calls update() method repeatedly at the rate indiciated by the int passed into the method
//  * @type {int}
//  */
// var z = window.setInterval(update, (1000/50));

// *
//  * Send notfication of collision event to engine core
//  * @param {int} object1 id (entity) of first object involved in collision
//  * @param {int} object2 id (entity) of second object involved in collision
 
// Moba.PhysicsSystem.prototype = function collisionAlert(object1, object2){

// };

// /**
//  * main function
//  * called at the regular interval as defined in init()
//  * edits the transform component once an object moves after a step()
//  */
// Moba.PhysicsSystem.prototype = function update(){


// };

// /**
//  * Adds rectangle to Box2D simulation
//  * Sets width, height, mass, and placement of object
//  * Creates object in Box2D world
//  * @param {int} canvaswidth
//  * @param {int} canvasheight
//  */
// Moba.PhysicsSystem.prototype = function addRectangle(canvaswidth, canvasheight){
// 	//create rectangle
// 	var bodyDef = new b2BodyDef;
// 	var fixDef = new b2FixtureDef;
// 	xDef.density = 0.4;
// 	fixDef.friction = 0.2;
// 	fixDef.restitution = 0.2;

// 	bodyDef.type = b2Body.b2_dynamicBody;
// 	fixDef.shape = new b2PolygonShape;
// 	var scale = 30;
// 	fixDef.shape.SetAsArray([
// 		new b2Vec2(scale*0.866 , scale*0.5),
// 		new b2Vec2(scale*-0.866, scale*0.5),
// 				new b2Vec2(0, scale*1),
// 				new b2Vec2(0, scale*-1)
// 			  	]);
// 	bodyDef.position.x = (canvaswidth-scale*2)*Math.random()+scale*2;
// 	bodyDef.position.y = canvasheight - (scale*Math.random() +scale);
// 	world.CreateBody(bodyDef).CreateFixture(fixDef);
// };

// /**
//  * Adds force to objectID within in physics simulation
//  *
//  * ApplyImpulse method signiture from Box2D file
//  * box2d.Body.prototype.ApplyImpulse = function(impulse, point)
//  * 
//  * @param {int} objectID Entity
//  * @param {vector} v is a vector composed of x and y components representing velocity in each direction
//  */
// Moba.PhysicsSystem.prototype = function addImpulse(objectID, v){

// };

// /**
//  * Stops the execution of the setInterval
//  * @param  {int} intervalVariable global variable set by initial setInterval() call
//  */
// Moba.PhysicsSystem.prototype = function cancelUpdate(intervalVariable){
// 	window.clearInterval(intervalVariable);
// };