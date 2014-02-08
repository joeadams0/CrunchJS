/**
 * @author Justin White
 */

goog.provide('CrunchJS.Systems.PhysicsSystem');
goog.require('box2d.World');
goog.require('CrunchJS.System');
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
 * Sets gravity to be having no effect on the world
 * @define {b2Vec2}
 */
//var b2Vec2 = Box2D.Common.Math.b2Vec2;
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

/**
 * Initializes world and objects.  Sets regular interval
 */
function init(){
	//create ground here if needed


	//create any objects that are needed in the scene at first
	addRectangle(5, 5);
};

/**
 * Calls update() method repeatedly at the rate indiciated by the int passed into the method
 * @type {int}
 */
var z = window.setInterval(update, (1000/50));

/**
 * Send notfication of collision event to engine core
 * @param {int} object1 id (entity) of first object involved in collision
 * @param {int} object2 id (entity) of second object involved in collision
 */
function collisionAlert(object1, object2){

};

/**
 * main function
 * called at the regular interval as defined in init()
 * edits the transform component once an object moves after a step()
 */
function update(){


};

/**
 * Adds rectangle to Box2D simulation
 * Sets width, height, mass
 * @param {int} w is width
 * @param {int} h is height
 */
function addRectangle(w, h){

};

/**
 * Adds force to objectID within in physics simulation
 * @param {int} objectID Entity
 * @param {vector} v is a vector composed of x and y components representing velocity in each direction
 */
function addImpulse(objectID, v){

};

/**
 * Stops the execution of the setInterval
 * @param  {int} intervalVariable global variable set by initial setInterval() call
 */
function cancelUpdate(intervalVariable){
	window.clearInterval(intervalVariable);
};