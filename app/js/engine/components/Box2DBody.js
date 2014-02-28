/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Box2DBody');

goog.require('CrunchJS.Component');

/**
 * Contains data about the velocity and the force on the object. 
 * @param {Object}  velocity  The Velocity of the component
 * @param {Object}  force     The force on the object
 * @param {number}  mass     The mass of the object
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Box2DBody = function(params) {

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
};

goog.inherits(CrunchJS.Components.Box2DBody, CrunchJS.Component);

CrunchJS.Components.Box2DBody.prototype.name = 'Box2DBody';