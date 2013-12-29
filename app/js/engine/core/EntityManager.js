/**
 * @author Joe Adams
 */

goog.provide("Engine.EntityManager");

goog.require('goog.array');

/**
 * Creates a new System Manager. 
 * @this {Engine.EntityManager}
 * @constructor
 * @class  Manages all of the Entities for the game (for internal use)
 */
Engine.EntityManager = function() {
	/**
	 * The array of all entities
	 * @type {Array}
	 * @protected
	 */
	this.entities = [];

	/**
	 * The array of the keys of the freed entities. Stores the unused spots in the entities array
	 * @type {Array}
	 * @protected
	 */
	this.entityPool = [];
};

/**
 * Creates an Entity
 * @return {Number} The id of the entity
 * @this {Engine.EntityManager}
 */
Engine.EntityManager.prototype.createEntity = function() {
	/**
	 * The id of the new entity
	 * @type {Number}
	 */
	var id = -1;

	// Checks if we have unused spots in the entities array. If we do, use them
	if(this.entityPool.length > 0)
		id = this.entityPool.pop();

	// If no free spots, add an entity to the array
	else{
		this.entities.push([]);
		id = this.entities.length - 1;
	}
	return id;
};

/**
 * Destroys the specified entity
 * @param  {Number} id The Id of the Entity to destroy
 * @this {Engine.EntityManager}
 */
Engine.EntityManager.prototype.destroyEntity = function(id) {
	this.entities[id] = [];
	this.entityPool.push(id);
};

/**
 * Returns an array of ids of entities with the component 	
 * @param  {String} compName The name of the Component
 * @return {Array}           An array of Entity Ids
 */
Engine.EntityManager.prototype.findEntities = function(compName) {
	var ents = [],
		// A function that returns true if the Entity has the component specified
		entSearcher = this.entitySearchGen(compName);

	goog.array.forEach(this.entities, function(entity, index) {

		if(entSearcher(entity))
			goog.array.insert(ents, index);
	});

	return ents;
};

/**
 * Adds a component to the entity
 * @param {Number} id   The id of the Entity to add the component to
 * @param {Engine.Component} comp The Component to add
 * @this {Engine.EntityManager}
 */
Engine.EntityManager.prototype.addComponent = function(id, comp) {
	if(this.entities.length > id)
		this.entities[id].push(comp);
};


/**
 * Removes a Component from an Entity
 * @param  {Number} id       The Id of the Entity
 * @param  {String} compName The name of the Component
 * @this {Engine.EntityManager}
 */
Engine.EntityManager.prototype.removeComponent = function(id, compName) {
	// compIder is a function that returns true if the the component passed in corresponds to the compName
	var compIder = this.componentIdentifierGen(compName);

	goog.array.removeIf(this.entities[id], compIder);
};

/**
 * Gets the array of components for the Entity
 * @param  {Number} id The Id of the Entity
 * @return {?Array.<Engine.Component>}     The Array of the components
 * @this {Engine.EntityManager}
 */
Engine.EntityManager.prototype.getComponents = function(id) {
	if(this.entities.length > id)
		return this.entities[id];
	return null;
};

/**
 * Gets the Component of the Entity
 * @param  {Number} id       The Id of the Entity
 * @param  {String} compName The String Identifier of the Component
 * @return {?Engine.Component} The Component or null if there is none
 * @this {Engine.EntityManager}
 * TODO
 */
Engine.EntityManager.prototype.getComponent = function(id, compName) {
	// compIder is a function that returns true if the the component passed in corresponds to the compName
	var compIder = this.componentIdentifierGen(compName);

	return goog.array.find(this.entities[id], compIder);
};

/**
 * Returns a function that will return true if the component passed in is the component corresponding to compName
 * @param  {String} compName The Component Name
 * @return {Function}          The predicate function
 * @this {Engine.EntityManager}
 * @protected
 */
Engine.EntityManager.prototype.componentIdentifierGen = function(compName) {

	// Returns true if the component is the one we are looking for
	return function(component) {
		return component.__identifier = compName;
	};
};

/**
 * Returns a function that will return true if the entity passed in contains a component corresponding to compName
 * @param  {String} compName The Component Name
 * @return {Function}          The predicate function
 * @this {Engine.EntityManager}
 * @protected
 */
Engine.EntityManager.prototype.entitySearchGen = function(compName) {
	// Identifies components based on name
	var compIdentifier = this.componentIdentifierGen(compName);

	// Returns true if the entity has the component
	return function(entity) {
		return goog.array.some(entity, compIdentifier);
	};
};