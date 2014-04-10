/**
 * @author Justin White
 */

goog.provide('CrunchJS.Components.Physics');

goog.require('CrunchJS.Component');

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

	

	this.objectId = objectId.params; 
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
	 * The velocity of the entity x
	 * @type {Object}
	 */
	this.velocityX = velocityX.params;

	/**
	 * The Velocity of the entity in the y
	 * @type {Object}
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


	this.radius = radius.params;

	this.recWidth = recWidth.params;

	this.recHeight = recHeight.params;
	/**
	 * Mass of the entity
	 * Can be calculated using Box2D
	 * @type {number}
	 */
	this.mass = mass.params;

	/**
	 * Rotation of the entity
	 * @type {number}
	 */
	this.rotation = rotation.params;

	/**
	 * Is the entity allowed to rotate?
	 * @type {Boolean}
	 */
	this.preventRotation = preventRotation.params;
};

goog.inherits(CrunchJS.Components.Physics, CrunchJS.Component);

CrunchJS.Components.Physics.prototype.name = 'Physics';

CrunchJS.Components.Physics.prototype.getObjectId = function() {
return this.objectId;
}

CrunchJS.Components.Physics.prototype.setObjectId = function(objectId) {
	if(objectId === this.objectId){
		this.objectId = objectId;
	}
}

/**
 * Gets x-cooridinate of component
 * @return {Number} x-cooridinate
 */
CrunchJS.Components.Physics.prototype.getPositionX = function() {
	return this.positionX;
};


/**
 * Gets the y-cooridinate of component
 * @return {Number} y-cooridinate
 */
CrunchJS.Components.Physics.prototype.getPositionY = function() {
	return this.positionY;
};

/**
 * Sets the x-cooridinate
 * @param {Number} positionX The x-cooridinate
 */
CrunchJS.Components.Physics.prototype.setPositionX = function(positionX) {
	if(positionX != this.positionX){
		this.positionX = positionX;
	}
};

/**
 * Sets the y-cooridinate
 * @param {Number} positionY The y-cooridinate
 */
CrunchJS.Components.Physics.prototype.setPositionY = function(positionY) {
	if(positionY != this.positionY){
		this.positionY = positionY;
	}
};



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
	}
};

/**
 * Sets the y-velocity
 * @param {Number} positionY The y-velocity
 */
CrunchJS.Components.Physics.prototype.setVelocityY = function(velocityY) {
	if(velocityY != this.velocityY){
		this.velocityY = velocityY;
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
	}
};

/**
 * Sets the y-force
 * @param {Number} forceY The y-force
 */
CrunchJS.Components.Physics.prototype.setForceY = function(forceY) {
	if(forceY != this.forceY){
		this.forceY = forceY;
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
	}
};

/**
 * Gets the rotation of component
 * @return {Number} rotation
 */
CrunchJS.Components.Rotation.prototype.getRotation = function() {
	return this.rotation;
};

/**
 * Sets the rotation
 * @param {Number} rotation The rotation
 */
CrunchJS.Components.Physics.prototype.setRotation = function(rotation) {
	if(rotation != this.rotation){
		this.rotation = rotation;
	}
};


/**
 * Gets if the component is allowed to rotate
 * @return {Boolean} preventRotation
 */
CrunchJS.Components.Rotation.prototype.getPreventRotation = function() {
	return this.preventRotation;
};

/**
 * Sets whether the component can rotate
 * @param {Boolean} preventRotation The rotation
 */
CrunchJS.Components.Physics.prototype.setRotation = function(preventRotation) {
	if(preventRotation != this.preventRotation){
		this.preventRotation = preventRotation;
	}
};
