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

	// Flags describing if a field has been updated
	this.updates = {
		x : false,
		y : false,
		isMovable : false,
		layer : false,
		rotation : false
	}
};

goog.inherits(CrunchJS.Components.Transform, CrunchJS.Component);

/**
 * The component type
 * @type {String}
 */
CrunchJS.Components.Transform.prototype.name = 'Transform';

/**
 * Gets the x pos
 * @return {Number} The x pos
 */
CrunchJS.Components.Transform.prototype.getX = function() {
	return this.x;
};

/**
 * Gets the y pos
 * @return {Number} The y pos
 */
CrunchJS.Components.Transform.prototype.getY = function() {
	return this.y;
};

/**
 * Sets the x pos
 * @param {Number} x The x pos
 */
CrunchJS.Components.Transform.prototype.setX = function(x) {
	if(x != this.x){
		this.x = x;
		this.updates.x = true;

		this.hasBeenUpdated();
	}
};

CrunchJS.Components.Transform.prototype.resetUpdates = function() {
	this.updates = goog.object.map(this.updates, function() {
		return false;
	});
};

/**
 * Sets the y pos
 * @param {Number} y The y pos
 */
CrunchJS.Components.Transform.prototype.setY = function(y) {
	if(y != this.y){
		this.y = y;
		this.updates.y = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the layer
 * @return {Number} The layer
 */
CrunchJS.Components.Transform.prototype.getLayer = function() {
	return this.layer;
};

/**
 * Sets the layer
 * @param {Number} layer The layer
 */
CrunchJS.Components.Transform.prototype.setLayer = function(layer) {
	if(this.layer != layer){
		this.layer = layer;
		this.updates.layer = true;

		this.hasBeenUpdated();
	}
};

/**
 * Gets the rotation
 * @return {Number} The rotation
 */
CrunchJS.Components.Transform.prototype.getRotation = function() {
	return this.rotation;
};

/**
 * Sets the rotation
 * @param {Number} rotation The rotation
 */
CrunchJS.Components.Transform.prototype.setRotation = function(rotation) {
	if(this.rotation != rotation){
		this.rotation = rotation;
		this.updates.rotation = true;
		this.hasBeenUpdated();
	}
};

/**
 * Checks if it is movable
 * @return {Boolean} True if is moveable
 */
CrunchJS.Components.Transform.prototype.isMovable = function() {
	return this.isMovable;
};

/**
 * Sets if the entity is moveable
 * @param {Boolean} isMovable 
 */
CrunchJS.Components.Transform.prototype.setIsMovable = function(isMovable) {
	if(this.isMovable != isMovable){
		this.isMovable = isMovable;
		this.updates.isMovable = true;

		this.hasBeenUpdated();
	}
};

CrunchJS.Components.Transform.prototype.getUpdates = function() {
	return goog.object.filter(this, function(obj, key) {
		if(!goog.isFunction(obj))
			return this.updates[key];
	}, this);
};