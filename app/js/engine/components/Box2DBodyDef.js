/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Box2DBodyDef');

goog.require('CrunchJS.Component');

/**
 * [Box2DBodyDef description]
 * @param {Object}  position        Position of the entity
 * @param {number}  rotation        Rotation of the entity
 * @param {Boolean}  allowSleep      Is sleep allowed by the entity?
 * @param {Boolean} isSleeping      Is the entity sleeping?
 * @param {Boolean}  preventrotation Is the entity allowed to rotate
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Box2DBodyDef = function(position, rotation, allowSleep, isSleeping, preventrotation) {

	
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
	 * @type {Boolean}
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