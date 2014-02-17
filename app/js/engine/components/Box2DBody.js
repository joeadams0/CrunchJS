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
CrunchJS.Components.Box2DBody = function(velocity, force, mass) {

	/**
	 * The velocity of the entity	
	 * @type {Object}
	 */
	this.velocity = velocity ? velocity : {
		x : 0,
		y : 0
	};

	/**
	 * The force on the entity
	 * @type {Object}
	 */
	this.force = force ? force : {
		x : 0,
		y : 0
	}

	/**
	 * Mass of the entity
	 * Can be calculated using Box2D
	 * @type {number}
	 */
	this.mass = mass;
};

goog.inherits(CrunchJS.Components.Box2DBody, CrunchJS.Component);

CrunchJS.Components.Box2DBody.prototype.name = 'Box2DBody';