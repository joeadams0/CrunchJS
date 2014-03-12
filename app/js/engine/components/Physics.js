/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Physics');

goog.require('CrunchJS.Component');

/**
 * [Physics description]
 * @param {Object}  positionX        Position of the entity
 * @param {Object}  positionY        Position of the entity
 * @param {number}  rotation        Rotation of the entity
 * @param {Boolean}  allowSleep      Is sleep allowed by the entity?
 * @param {Boolean} isSleeping      Is the entity sleeping?
 * @param {Boolean}  preventrotation Is the entity allowed to rotate
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Physics = function(params) {

	
	/**
	 * Position of the entity in x direction
	 * @type {int}
	 */
	this.positionX = positionX.params;

	/**
	 * Position of the entity in y direction
	 * @type {int}
	 */
	this.positionY = positionY.params;
	

	/**
	 * The velocity of the entity x
	 * @type {Object}
	 */
	this.velocityX = velocityX.params;

	/**
	 * The Velocity of the entity in the y
	 * @type {[type]}
	 */
	this.velocityY = velocityY.params;

	/**
	 * The force on the entity x
	 * @type {Object}
	 */
	this.forceX = forceX.params;

	/**
	 * The force on the entity y
	 * @type {Object}
	 */
	this.forceY = forceY.params;

	/**
	 * Mass of the entity
	 * Can be calculated using Box2D
	 * @type {number}
	 */
	this.mass = mass.params;

	/**
	 * Rotation of the entity
	 * @type {number}
	 */
	this.rotation = rotation.params;

	/**
	 * Is sleep allowed for the entity?
	 * @type {Boolean}
	 */
	this.allowSleep = allowSleep.params;

	/**
	 * Is the entity sleeping?
	 * @type {Boolean}
	 */
	this.isSleeping = isSleeping.params;

	/**
	 * Is the entity allowed to rotate?
	 * @type {Boolean}
	 */
	this.preventrotation = preventrotation.params;
};

goog.inherits(CrunchJS.Components.Physics, CrunchJS.Component);

CrunchJS.Components.Physics.prototype.name = 'Physics';