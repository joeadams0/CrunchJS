/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Transform');

goog.require('CrunchJS.Component');

/**
 * Contains data about the postitioning and rotation of the object. Use this if you want your entity to have a position in the world.
 * @param {number=}  params.x    The x position
 * @param {number=}  params.y     The y position
 * @param {number} params.layer The layer of the entity
 * @param {Boolean} params.isMovable Should this object be allowed to be moved
 * @param {Number=} params.rotation The rotation of the entity
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Transform = function(params) {

	/**
	 * The x position
	 * @type {number}
	 */
	this.x = params.x ? params.x : 0;

	/**
	 * The y postition
	 * @type {number}
	 */
	this.y = params.y ? params.y : 0;

	/**
	 * Is this object moveable
	 * @type {Boolean}
	 */
	this.isMovable = params.isMovable ? params.isMovable : true;


	/**
	 * The layer of an entity is used to describe which 'z' layer of the game this entity is on.
	 * For instance, if entities were on two different layers, they would not collide.
	 * The layer variable is just a bit flag number. You can have up to 32 layers.
	 * @type {number}
	 */
	this.layer = params.layer | 0x00000001;

	/**
	 * The rotation of the entity
	 * @type {Number}
	 */
	this.rotation = params.rotation | 0.0;
};

goog.inherits(CrunchJS.Components.Transform, CrunchJS.Component);

/**
 * The component type
 * @type {String}
 */
CrunchJS.Components.Transform.prototype.name = 'Transform';