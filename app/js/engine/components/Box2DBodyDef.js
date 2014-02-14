/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Box2DBodyDef');

goog.require('CrunchJS.Component');

/**
 * Contains data about the velocity and the force on the object. 
 * @param {Object}  velocity  The Velocity of the component
 * @param {Object}  force     The force on the object
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Box2DBodyDef = function(velocity, force, position, rotation, allowSleep, isSleeping, preventrotation) {

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
	 * Position of the entity
	 * @type {Object}
	 */
	this.position = position ? position : {
		x : 0,
		y : 0
	}
	/**
	 * Rotation of the entity
	 * @type {number}
	 */
	this.rotation = rotation;

	/**
	 * Is sleep allowed for the entity?
	 * @type {boolean}
	 */
	this.allowSleep = allowSleep;

	/**
	 * Is the entity sleeping?
	 * @type {Boolean}
	 */
	this.isSleeping = isSleeping;

	/**
	 * Is the entity allowed to rotate?
	 * @type {Boolean}
	 */
	this.preventrotation = preventrotation;
};

goog.inherits(CrunchJS.Components.Box2DBodyDef, CrunchJS.Component);

CrunchJS.Components.Box2DBodyDef.prototype.name = 'Box2DBodyDef';