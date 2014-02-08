/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Transform');

goog.require('CrunchJS.Component');

/**
 * Contains data about the postitioning and rotation of the object. Use this if you want your entity to have a position in the world.
 * @param {number}  [x=0]     The x position
 * @param {number}  [y=0]     The y position
 * @param {Boolean} [isMovable=true] Should this object be allowed to be moved
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Transform = function(x,y,isMovable) {

	/**
	 * The x position
	 * @type {number}
	 */
	this.x = x ? x : 0;

	/**
	 * The y postition
	 * @type {number}
	 */
	this.y = y ? y : 0;

	/**
	 * Is this object moveable
	 * @type {Boolean}
	 */
	this.isMovable = isMovable ? isMovable : true;

	/**
	 * Has the object moved this frame
	 * @type {Boolean}
	 */
	this.hasMoved = false;
};

goog.inherits(CrunchJS.Components.Transform, CrunchJS.Component);

/**
 * The component type
 * @type {String}
 */
CrunchJS.Components.Transform.prototype.name = 'Transform';