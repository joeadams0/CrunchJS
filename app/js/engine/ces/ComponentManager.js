/**
 * @author  Joe Adams
 */

goog.provide('CrunchJS.ComponentManager');


goog.require('CrunchJS.Manager');
goog.require('CrunchJS.Utils.BitSetOperator');
goog.require('CrunchJS.EntityComposition');

goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');


/**
 * Creates an instance
 * @constructor
 * @class Manages all components
 * @param {CrunchJS.Scene} scene The Scene the manager is in
 * @extends {CrunchJS.Manager}
 */
CrunchJS.ComponentManager = function(scene) {
	goog.base(this, scene);

	/**
	 * A map of component types to their component type id
	 * @type {goog.structs.Map}
	 * @private
	 */
	this._compIndecies = new goog.structs.Map();

	/**
	 * An array of maps of entity ids to components 
	 * @type {Array}
	 * @private
	 */
	this._componentMaps = [];

	/**
	 * The array of entity compositions
	 * @type {Array}
	 * @private
	 */
	this._entityCompostitions = [];

	/**
	 * The bitset operator
	 * @type {CrunchJS.Utils.BitSetOperator}
	 */
	this.bitSetOperator = CrunchJS.Utils.BitSetOperator.getInstance();

	/**
	 * Holds all of the destroyed entities to be cleared
	 * @type {goog.structs.Set}
	 */
	this._destroyedEntities = new goog.structs.Set();


	var entityAddedListener = goog.bind(this.entityCreated,this),
		entityDestroyedListener = goog.bind(this.entityDestroyed,this);

	this.getScene().addListener(CrunchJS.Events.EntityCreated, entityAddedListener);
	this.getScene().addListener(CrunchJS.Events.EntityDestroyed, entityDestroyedListener);

};

goog.inherits(CrunchJS.ComponentManager, CrunchJS.Manager);

/**
 * Creates a blank entity composition object
 * @return {CrunchJS.EntityComposition} The composition
 */
CrunchJS.ComponentManager.prototype.createEntityComposition = function() {
	return new CrunchJS.EntityComposition(this);
};

/**
 * Checks if an entity matches an entity composition
 * @param  {number} entityId The entity id
 * @param  {CrunchJS.EntityComposition} entComp  The entity composition
 * @return {Boolean}          True if it matches the composition
 */
CrunchJS.ComponentManager.prototype.matchesComposition = function(entityId, entComp) {
	return entComp.matches(this.getEntityComposition(entityId));
};

/**
 * Creates a new component type
 * @param  {string} compName The name of the new component
 * @return {number}          The comp index
 */
CrunchJS.ComponentManager.prototype.createComponentType = function(compName) {
	var compTypeId = this._componentMaps.push(new goog.structs.Map());
	this._compIndecies.set(compName, compTypeId); 

	return compTypeId;
};

/**
 * Adds a component to an entity
 * @param {number} entityId  The entity id
 * @param {CrunchJS.Component} component The component to add
 */
CrunchJS.ComponentManager.prototype.addComponent = function(entityId, component) {
	var compTypeId;

	// We havent seen this type of component, so we must create a new type
	if(!this.hasComponentType(component.name)){
		compTypeId = this.createComponentType(component.name);
	}
	else
		compTypeId = this.getComponentIndex(component.name);
	
	this.getComponentMap(compTypeId).set(entityId, component);

	this.setComponentBit(entityId, compTypeId);

	component.entityId = entityId;
	this.getScene().fireEvent(CrunchJS.Events.EntityChanged, entityId);
};

/**
 * Removes the component from the entity
 * @param  {number} entityId      The entity Id
 * @param  {string} componentName The name of the component
 * @return {Boolean}              True if the component was found and removed
 */
CrunchJS.ComponentManager.prototype.removeComponent = function(entityId, componentName) {
	if(this.hasComponentType(componentName)){
		var compTypeId = this.getComponentIndex(componentName),
			success,
			compMap = this.getComponentMap(compTypeId),
			comp = compMap.get(entityId);

		
		success = this.getComponentMap(compTypeId).remove(entityId);

		if(success){
			this.clearComponentBit(entityId, compTypeId);
			comp.entityId = null;
			this.getScene().fireEvent(CrunchJS.Events.EntityChanged, entityId);
		}

		return success;
	}
	return false;
};

/**
 * Gets the map of ids -> components for a type
 * @param  {number} compId The component id
 * @return {goog.structs.Map}  The component map
 */
CrunchJS.ComponentManager.prototype.getComponentMap = function(compId) {
	return this._componentMaps[compId-1];
};

/**
 * Checks if the entity has the component type
 * @param  {number}  entityId The entity id
 * @param  {string}  compName The component name
 * @return {Boolean}          True if it has the component
 */
CrunchJS.ComponentManager.prototype.hasComponent = function(entityId, compName) {
	return this.hasComponentBit(entityId, compName);
};

/**
 * Gets a component for an entity if it has it
 * @param  {number} entityId The Entity Id
 * @param  {string} compName The component name
 * @return {CrunchJS.Component}          The component
 */
CrunchJS.ComponentManager.prototype.getComponent = function(entityId, compName) {
	if(this.hasComponentType(compName))
		return this.getComponentsByType(compName).get(entityId);

	return null;
};

/**
 * Gets all of the components for an entity
 * @param  {number} entityId The entity id
 * @return {goog.structs.Set}          The set of components
 */
CrunchJS.ComponentManager.prototype.getComponents = function(entityId) {
	var comps = new goog.structs.Set();

	for(var i = 0, len = this._componentMaps.length; i<len; i++){
		if(this._componentMaps[i].contains(entityId))
			comps.add(this._componentMaps[i].get(entityId));
	}

	return comps;
};

/**
 * Gets a list of all of the components of a given type
 * @param  {string} compName The name of the component
 * @return {goog.structs.Map}          A map of entity ids -> components
 */
CrunchJS.ComponentManager.prototype.getComponentsByType= function(compName) {
	if(this.hasComponentType(compName))
		return this.getComponentMap(this.getComponentIndex(compName));
	return null;
};

/**
 * Sets the component bit in the entity compostion for the component type
 * @param {number} entityId The entity Id
 * @param {(number|string)} compType The component type - can be the index or the name of the component
 */
CrunchJS.ComponentManager.prototype.setComponentBit = function(entityId, compType) {
	if(typeof compType == 'string'){
		compType = this.getComponentIndex(compType);
	}

	this.bitSetOperator.set(this.getEntityComposition(entityId), compType);
};

/**
 * Clears the component bit in the entity composition for the components
 * @param  {number} entityId The Id of the entity
 * @param  {(number|string)} compType The component type can be the name of the component or its index
 */
CrunchJS.ComponentManager.prototype.clearComponentBit = function(entityId, compType) {
	if(typeof compType == 'string'){
		compType = this.getComponentIndex(compType);
	}

	this.bitSetOperator.clear(this.getEntityComposition(entityId), compType);
};

/**
 * Checks if the component bit is set for an entity
 * @param  {number}  entityId The entity id
 * @param  {(number|string)}  compType The component type
 * @return {Boolean}          True if it has the bit
 */
CrunchJS.ComponentManager.prototype.hasComponentBit = function(entityId, compType) {
	if(typeof compType == 'string'){
		compType = this.getComponentIndex(compType);
	}

	return this.bitSetOperator.get(this.getEntityComposition(entityId), compType);
};

/**
 * Gets the entity composition bitset
 * @param  {number} entityId The entity id
 * @return {Array}          The bitset
 */
CrunchJS.ComponentManager.prototype.getEntityComposition = function(entityId) {
	return this._entityCompostitions[entityId];
}

/**
 * Sets the entity Composition bitset
 * @param {number} entityId The entity Id
 * @param {Array} bitset   The bitset
 */
CrunchJS.ComponentManager.prototype.setEntityComposition = function(entityId, bitset) {
	this._entityCompostitions[entityId] = bitset;
};

/**
 * Returns true if the manager is tracking the component of that type
 * @param  {String}  type The name of the component
 * @return {Boolean}      True if the manager has seen a component of that type
 */
CrunchJS.ComponentManager.prototype.hasComponentType = function(type) {
	return this._compIndecies.containsKey(type);
};

/**
 * Gets the Component Index
 * @param  {String} componentName The component Name
 * @return {number}               The index
 */
CrunchJS.ComponentManager.prototype.getComponentIndex = function(componentName) {
	return this._compIndecies.get(componentName);
};

/**
 * Removes all of the components from the entity
 * @param  {number} entityId The entity id
 */
CrunchJS.ComponentManager.prototype.removeComponentsOfEntity = function(entityId) {
	var composition = this.getEntityComposition(entityId),
		len = this.bitSetOperator.length(composition);

	for(var i = 0; i<len; i++){
		
		// If the bit is set, remove the component
		if(this.bitSetOperator.get(i)){
			this.getComponentMap(i).remove(entityId);
			this.bitSetOperator.clear(i);
		}
	}

	this.getScene().fireEvent(CrunchJS.Events.EntityChanged, entityId);
};

/**
 * Called when an entity is created
 * @param  {number} entityId The entityId
 */
CrunchJS.ComponentManager.prototype.entityCreated = function(entityId) {
	this._entityCompostitions[entityId] = this.bitSetOperator.createBitSet();
}; 

/**
 * Called when an entity is destroyed
 * @param  {number} entityId The entity id
 */
CrunchJS.ComponentManager.prototype.entityDestroyed = function(entityId) {
	this._destroyedEntities.add(entityId);
};

/**
 * Cleans up the destroyed entitites
 */
CrunchJS.ComponentManager.prototype.clean = function() {
	var iterator = function(entityId) {
		var composition = this.getEntityComposition(entityId),
			len = this.bitSetOperator.length(composition);

		for(var i = 0; i<len; i++){
			
			// If the bit is set, remove the component
			if(this.bitSetOperator.get(i)){
				this.getComponentMap(i).remove(entityId);
				this.bitSetOperator.clear(i);
			}
		}
	};
	goog.structs.forEach(this._destroyedEntities, goog.bind(iterator, this));

	this._destroyedEntities.clear();
};
