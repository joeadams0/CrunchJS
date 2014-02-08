/**
 * @author Justin White
 */

goog.provide('Moba.PhysicsSystem');

goog.require('CrunchJS.System');

/**
 * Creates an example system
 * @extends {CrunchJS.System}
 * @constructor
 * @class An Example System
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
 * Send location of objects to renderer
 * @return 3D array containing object id, x-coordinate, y - cooridinate
 */
function locPhysicsToRender(){
	return arrayLoc;
}

/**
 * Send notfication of collision event to engine core
 * @param1 object1 id (entity #) of first object involved in collision
 * @param2 object2 id (entity #) of second object involved in collision
 */
//
//object1 and object2 are the id's (entinty's) of the two objects that collided
function collisionAlert(object1, object2){

}

/**
 * Initializes world and objects
 * Sets regular interval
 */
function init(){

}

/**
 * main function
 * called at the regular interval as defined in init()
 */
function update(){


}

/**
 * Adds rectangle to Box2D simulation
 */
function addRectangle(){

}

/**
 * Adds force to objectID within in physics simulation
 * v is a vector composed of x and y components representing force in each direction
 */
function addImpulse(objectID, v){

}