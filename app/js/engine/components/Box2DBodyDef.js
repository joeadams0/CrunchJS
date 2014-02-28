/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Box2DBodyDef');

goog.require('CrunchJS.Component');

/**
 * [Box2DBodyDef description]
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
CrunchJS.Components.Box2DBodyDef = function(params) {

	
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

goog.inherits(CrunchJS.Components.Box2DBodyDef, CrunchJS.Component);

CrunchJS.Components.Box2DBodyDef.prototype.name = 'Box2DBodyDef';