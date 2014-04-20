/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Physics');

goog.require('CrunchJS.Component');

goog.require('goog.object');

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
	goog.base(this, params);
	
	var defaults = {
		velocityX : 0,
		velocityY : 0,
		forceX : 0,
		forceY : 0,
		radius : 0,
		recWidth : 5,
		recHeight : 5,
		mass : 1,
		rotation : 0,
		preventRotation : true

	}


	if(!params)
		params = {};

	goog.object.forEach(defaults, function(val, key) {
		if(!params[key])
			params[key] = val;
	});
	this.objectId = params.objectId; 

	/**
	 * The velocity of the entity x
	 * @type {Object}
	 */
	this.velocityX = params.velocityX;

	/**
	 * The Velocity of the entity in the y
	 * @type {Object}
	 */
	this.velocityY = params.velocityY;

	/**
	 * The force on the entity x
	 * @type {Object}
	 */
	this.forceX = params.forceX;

	/**
	 * The force on the entity y
	 * @type {Object}
	 */
	this.forceY = params.forceY;


	this.radius = params.radius;

	this.recWidth = params.recWidth;

	this.recHeight = params.recHeight;
	/**
	 * Mass of the entity
	 * Can be calculated using Box2D
	 * @type {number}
	 */
	this.mass = params.mass;

	/**
	 * Rotation of the entity
	 * @type {number}
	 */
	this.rotation = params.rotation;

	/**
	 * Is the entity allowed to rotate?
	 * @type {Boolean}
	 */
	this.preventRotation = params.preventRotation;

	this.updates = {};
};

goog.inherits(CrunchJS.Components.Physics, CrunchJS.Component);

CrunchJS.Components.Physics.prototype.name = 'Physics';

CrunchJS.Components.Physics.prototype.getObjectId = function() {
return this.objectId;
}

CrunchJS.Components.Physics.prototype.setObjectId = function(objectId) {
	if(objectId === this.objectId){
		this.objectId = objectId;
		this.updates.objectId = true;
		this.hasBeenUpdated();
	}
}

CrunchJS.Components.Physics.prototype.getRadius = function() {
	return this.radius;
};

/**
 * Sets the x-cooridinate
 * @param {Number} positionX The x-cooridinate
 */
CrunchJS.Components.Physics.prototype.setRadius = function(radius) {
	if(radius != this.radius){
		this.radius = radius;
		this.updates.radius = true;
		this.hasBeenUpdated();
	}
};

CrunchJS.Components.Physics.prototype.getRecWidth = function() {
	return this.recWidth;
};

/**
 * Sets the x-cooridinate
 * @param {Number} positionX The x-cooridinate
 */
CrunchJS.Components.Physics.prototype.setRecWidth = function(recWidth) {
	if(recWidth != this.recWidth){
		this.recWidth = recWidth;
		this.updates.recWidth = true;
		this.hasBeenUpdated();
	}
};

CrunchJS.Components.Physics.prototype.getRecHeight = function() {
	return this.recHeight;
};

/**
 * Sets the x-cooridinate
 * @param {Number} positionX The x-cooridinate
 */
CrunchJS.Components.Physics.prototype.setRecHeight = function(recHeight) {
	if(recHeight != this.recHeight){
		this.recHeight = recHeight;
		this.updates.recHeight = true;
		this.hasBeenUpdated();
	}
};



/**
 * Gets x-velocity of component
 * @return {Number} x-velocity
 */
CrunchJS.Components.Physics.prototype.getVelocityX = function() {
	return this.velocityX;
};


/**
 * Gets the y-velocity of component
 * @return {Number} y-velocity
 */
CrunchJS.Components.Physics.prototype.getVelocityY = function() {
	return this.velocityY;
};

/**
 * Sets the x-velocity
 * @param {Number} positionX The x-velocity
 */
CrunchJS.Components.Physics.prototype.setVelocityX = function(velocityX) {
	if(velocityX != this.velocityX){
		this.velocityX = velocityX;
		this.updates.velocityX = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the y-velocity
 * @param {Number} positionY The y-velocity
 */
CrunchJS.Components.Physics.prototype.setVelocityY = function(velocityY) {
	if(velocityY != this.velocityY){
		this.velocityY = velocityY;
		this.updates.velocityY = true;
		this.hasBeenUpdated();
	}
};



/**
 * Gets x-force of component
 * @return {Number} x-force
 */
CrunchJS.Components.Physics.prototype.getForceX = function() {
	return this.forceX;
};


/**
 * Gets the y-force of component
 * @return {Number} y-force
 */
CrunchJS.Components.Physics.prototype.getForceY = function() {
	return this.forceY;
};

/**
 * Sets the x-force
 * @param {Number} forceX The x-force
 */
CrunchJS.Components.Physics.prototype.setforceX = function(forceX) {
	if(forceX != this.forceX){
		this.forceX = forceX;
		this.updates.forceX = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the y-force
 * @param {Number} forceY The y-force
 */
CrunchJS.Components.Physics.prototype.setForceY = function(forceY) {
	if(forceY != this.forceY){
		this.forceY = forceY;
		this.updates.forceY = true;
		this.hasBeenUpdated();
	}
};


/**
 * Gets the mass of component
 * @return {Number} mass
 */
CrunchJS.Components.Physics.prototype.getMass = function() {
	return this.mass;
};

/**
 * Sets the mass
 * @param {Number} mass The mass
 */
CrunchJS.Components.Physics.prototype.setMass = function(mass) {
	if(mass != this.mass){
		this.mass = mass;
		this.updates.mass = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the rotation of component
 * @return {Number} rotation
 */
CrunchJS.Components.Physics.prototype.getRotation = function() {
	return this.rotation;
};

/**
 * Sets the rotation
 * @param {Number} rotation The rotation
 */
CrunchJS.Components.Physics.prototype.setRotation = function(rotation) {
	if(rotation != this.rotation){
		this.rotation = rotation;
		this.updates.rotation = true;
		this.hasBeenUpdated();
	}
};


/**
 * Gets if the component is allowed to rotate
 * @return {Boolean} preventRotation
 */
CrunchJS.Components.Physics.prototype.getPreventRotation = function() {
	return this.preventRotation;
};

/**
 * Sets whether the component can rotate
 * @param {Boolean} preventRotation The rotation
 */
CrunchJS.Components.Physics.prototype.setPreventRotation = function(preventRotation) {
	if(preventRotation != this.preventRotation){
		this.preventRotation = preventRotation;
		this.updates.preventRotation = true;
		this.hasBeenUpdated();
	}
};

CrunchJS.Components.Physics.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};