/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Rectangle');

goog.require('CrunchJS.Component'); 


/**
 * Defines the shape of the Rectangle
 * @param {Object} vertex1 Defines the location of one point of a rectangle with a x, y vector
 * @param {Object} vertex2 Defines the location of one point of a rectangle with a x, y vector
 * @param {Object} vertex3 Defines the location of one point of a rectangle with a x, y vector
 * @param {Object} vertex4 Defines the location of one point of a rectangle with a x, y vector
 * @param {number} density Density of the entity
 * @param {number} friction Friction of the entity
 * @param {number} restitution Restitution of the entity
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Rectangle = function(params) {

	/**
	 * The height of the entity	
	 * @type {Object}
	 */
	this.height = height.params;

	/**
	 * The height of the entity	
	 * @type {Object}
	 */
	this.width = width.params;

	/**
	 * Density of the entity
	 * @type {number}
	 */
	this.density = density.params;

	/**
	 * Friction of the entity
	 * @type {number}
	 */
	this.friction = friction.params;

	/**
	 * Restitution of the entity
	 * @type {number}
	 */
	this.restitution = restitution.params;
};

goog.inherits(CrunchJS.Components.Rectangle, CrunchJS.Component);

CrunchJS.Components.Rectangle.prototype.name = 'Rectangle';