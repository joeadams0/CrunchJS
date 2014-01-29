/**
 * @author Joe Adams
 */

/**
 * @namespace Entity Manager
 */
goog.provide("CrunchJS.EntityManager");

goog.require('goog.array');
goog.require('goog.structs.Set');

goog.require('CrunchJS.Manager');

/**
 * Creates a new System Manager.
 * @this {CrunchJS.EntityManager}
 * @constructor
 * @extends {CrunchJS.Manager} 
 * @class  Manages all of the Entities for the game (for internal use)
 */
CrunchJS.EntityManager = function(scene) {

	goog.base(this, scene);

	/**
	 * The array of all entities
	 * @type {Array}
	 * @protected
	 */
	this._nextEntityId = 1;

	/**
	 * The enabled entities
	 * @type {goog.structs.Set}
	 */
	this._enabledEntities = new goog.structs.Set();

	/**
	 * The disabled entities
	 * @type {goog.structs.Set}
	 */
	this._disabledEntities = new goog.structs.Set();

	/**
	 * The array of the keys of the freed entities. Stores the unused spots in the entities array
	 * @type {Array}
	 * @protected
	 */
	this._entityPool = [];



};

goog.inherits(CrunchJS.EntityManager, CrunchJS.Manager);

/**
 * Creates an Entity
 * @return {Number} The id of the entity
 * @this {CrunchJS.EntityManager}
 */
CrunchJS.EntityManager.prototype.createEntity = function() {
	/**
	 * The id of the new entity
	 * @type {Number}
	 */
	var id = this._nextEntityId;

	// Checks if we have unused spots in the entities array. If we do, use them
	if(this._entityPool.length > 0) {
		id = this._entityPool.pop();
	}

	this.getEnabledEntities().add(id);

	// Throw event that an entity was created
	this.getScene().fireEvent(CrunchJS.Events.EntityCreated, id);

	this._nextEntityId++;
	
	return id;
};

/**
 * Destroys the specified entity
 * @param  {Number} id The Id of the Entity to destroy
 * @this {CrunchJS.EntityManager}
 */
CrunchJS.EntityManager.prototype.destroyEntity = function(id) {
	this._entityPool.push(id);

	if(!this.getEnabledEntities().remove(id))
		this.getDisabledEntities().remove(id);

	this.getScene().fireEvent(CrunchJS.Events.EntityDestroyed, id);
};

/**
 * Enables an entity
 * @param  {number} id The Id of the entity
 */
CrunchJS.EntityManager.prototype.enableEntity = function(id) {
	
	this.getDisabledEntities().remove(id);

	this.getEnabledEntities().add(id);

	this.getScene().fireEvent(CrunchJS.Events.EntityEnabled, id);
};

/**
 * Disables an entity
 * @param  {number} id The entity id
 */
CrunchJS.EntityManager.prototype.disableEntity = function(id) {
	this.getEnabledEntities().remove(id);
	
	this.getDisabledEntities().add(id);

	this.getScene().fireEvent(CrunchJS.Events.EntityDisabled, id);
};

/**
 * Gets a set of enabled entities
 * @return {goog.structs.Set} The set
 */
CrunchJS.EntityManager.prototype.getEnabledEntities = function() {
	return this._enabledEntities;
};

/**
 * Gets a set of disabled entities
 * @return {goog.structs.Set} The set
 */
CrunchJS.EntityManager.prototype.getDisabledEntities = function() {
	return this._disabledEntities;
};