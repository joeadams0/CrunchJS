/**
 * @author  Joe Adams
 */

goog.provide('CrunchJS.Internal.ComponentManager');


goog.require('CrunchJS.Internal.Manager');
goog.require('CrunchJS.Utils.BitSetOperator');
goog.require('CrunchJS.EntityComposition');

goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');
goog.require('goog.object');
goog.require('goog.array');


/**
 * Creates an instance
 * @constructor
 * @class Manages all components
 * @param {CrunchJS.Scene} scene The Scene the manager is in
 * @extends {CrunchJS.Internal.Manager}
 */
CrunchJS.Internal.ComponentManager = function(scene) {
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
	

	

	// Listen for external commands
	this.getScene().addEventListener(CrunchJS.Events.EntityCreated, goog.bind(this.entityCreated,this));
	this.getScene().addEventListener(CrunchJS.Events.EntityDestroyed, goog.bind(this.entityDestroyed,this));
	this.getScene().addEventListener(CrunchJS.Events.ComponentUpdated, goog.bind(this.componentUpdated,this));

	// Listen for sync commands
	this.getScene().addEventListener(CrunchJS.EngineCommands.UpdateComponent, goog.bind(this.onUpdateComponent, this));
	this.getScene().addEventListener(CrunchJS.EngineCommands.AddComponent, goog.bind(this.onAddComponent, this));
	this.getScene().addEventListener(CrunchJS.EngineCommands.RemoveComponent, goog.bind(this.onRemoveComponent, this));
	this.getScene().addEventListener(CrunchJS.EngineCommands.RemoveAllComponents, goog.bind(this.onRemoveAllComponents, this));

};

goog.inherits(CrunchJS.Internal.ComponentManager, CrunchJS.Internal.Manager);


/**
 * Called when activated
 */
CrunchJS.Internal.ComponentManager.prototype.activate = function() {
	goog.base(this, 'activate');
};

/**
 * Updates a component from a remote engine
 * @param  {Object} data The data from the remote engine
 * @private
 */
CrunchJS.Internal.ComponentManager.prototype.onUpdateComponent = function(data) {
	if(CrunchJS.DATA_SYNC_DEBUG)
		CrunchJS.world.log('Entity Updated:' + JSON.stringify(data));
	this._setComponent(data['id'], this.deserialize(data['comp']));
};


/**
 * Adds a component from a remote engine
 * @param  {Object} data The data from the remote engine
 */
CrunchJS.Internal.ComponentManager.prototype.onAddComponent = function(data) {
	if(CrunchJS.DATA_SYNC_DEBUG)
		CrunchJS.world.log('Add component: '+ JSON.stringify(data));
	this._setComponent(data['id'], this.deserialize(data['comp']));
};

/**
 * Remove a component command from a remote engine
 * @param  {Object} data The data from the remote engine
 */
CrunchJS.Internal.ComponentManager.prototype.onRemoveComponent = function(data) {
	if(CrunchJS.DATA_SYNC_DEBUG)
		CrunchJS.world.log('Remove component: '+ JSON.stringify(data));
	this._removeComponent(data['id'], data['compName']);
};

/**
 * Removes all components 	
 * @param  {number} entityId The entity id
 */
CrunchJS.Internal.ComponentManager.prototype.onRemoveAllComponents = function(entityId) {
	if(CrunchJS.DATA_SYNC_DEBUG)
		CrunchJS.world.log('Remove All Components: '+entityId);

	this._removeAllComponents(entityId);
};

/**
 * Creates a blank entity composition object
 * @return {CrunchJS.EntityComposition} The composition
 */
CrunchJS.Internal.ComponentManager.prototype.createEntityComposition = function() {
	return new CrunchJS.EntityComposition(this);
};

/**
 * Checks if an entity matches an entity composition
 * @param  {number} entityId The entity id
 * @param  {CrunchJS.EntityComposition} entComp  The entity composition
 * @return {Boolean}          True if it matches the composition
 */
CrunchJS.Internal.ComponentManager.prototype.matchesComposition = function(entityId, entComp) {
	return entComp.matches(this.getEntityComposition(entityId));
};

/**
 * Creates a new component type
 * @param  {string} compName The name of the new component
 * @return {number}          The comp index
 */
CrunchJS.Internal.ComponentManager.prototype.createComponentType = function(compName) {
	var compTypeId = this._componentMaps.push(new goog.structs.Map());
	this._compIndecies.set(compName, compTypeId); 

	return compTypeId;
};

/**
 * Adds a component to an entity
 * @param {number} entityId  The entity id
 * @param {CrunchJS.Internal.Component} component The component to add
 */
CrunchJS.Internal.ComponentManager.prototype.addComponent = function(entityId, component) {
	this._setComponent(entityId, component);

	var data = {
		'id' : entityId,
		'comp' : this.serialize(component)
	}
	this.getScene().postEventToRemoteEngine(CrunchJS.EngineCommands.AddComponent, data);
};

/**
 * Sets the component for the entity
 * @param {number} entityId The entity id
 * @param {CrunchJS.Component} component     The component
 * @private
 */
CrunchJS.Internal.ComponentManager.prototype._setComponent = function(entityId, component) {
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
CrunchJS.Internal.ComponentManager.prototype.removeComponent = function(entityId, componentName) {
	var success = this._removeComponent(entityId, componentName);
	if(success){
		var data = {
			'id' : entityId,
			'compName' : componentName
		};
		this.getScene().postEventToRemoteEngine(CrunchJS.EngineCommands.RemoveComponent, data);
	}

	return success;
};

/**
 * Removes the component from the entity
 * @param  {number} entityId      The entity Id
 * @param  {string} componentName The name of the component
 * @return {Boolean}              True if the component was found and removed
 * @private
 */
CrunchJS.Internal.ComponentManager.prototype._removeComponent = function(entityId, componentName) {
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
CrunchJS.Internal.ComponentManager.prototype.getComponentMap = function(compId) {
	return this._componentMaps[compId-1];
};

/**
 * Checks if the entity has the component type
 * @param  {number}  entityId The entity id
 * @param  {string}  compName The component name
 * @return {Boolean}          True if it has the component
 */
CrunchJS.Internal.ComponentManager.prototype.hasComponent = function(entityId, compName) {
	return this.hasComponentBit(entityId, compName);
};

/**
 * Gets a component for an entity if it has it
 * @param  {number} entityId The Entity Id
 * @param  {string} compName The component name
 * @return {CrunchJS.Internal.Component}          The component
 */
CrunchJS.Internal.ComponentManager.prototype.getComponent = function(entityId, compName) {
	if(this.hasComponentType(compName))
		return this.getComponentsByType(compName).get(entityId);

	return null;
};

/**
 * Gets all of the components for an entity
 * @param  {number} entityId The entity id
 * @return {goog.structs.Set}          The set of components
 */
CrunchJS.Internal.ComponentManager.prototype.getComponents = function(entityId) {
	var comps = new goog.structs.Set();

	for(var i = 0, len = this._componentMaps.length; i<len; i++){
		if(this._componentMaps[i].containsKey(entityId))
			comps.add(this._componentMaps[i].get(entityId));
	}

	return comps;
};

/**
 * Finds all of the active entities for a certain composition
 * @param  {CrunchJS.EntityComposition} entityComp The entity composition
 * @return {goog.structs.Set()}            A set of the entity ids
 */
CrunchJS.Internal.ComponentManager.prototype.findEntities = function(entityComposition) {
	var set = new goog.structs.Set();

	goog.array.forEach(this._entityCompostitions, function(comp, id) {
		if(this.matchesComposition(id, entityComposition))
			set.add(id);
	}, this);

	return set;
};

/**
 * Gets a list of all of the components of a given type
 * @param  {string} compName The name of the component
 * @return {goog.structs.Map}          A map of entity ids -> components
 */
CrunchJS.Internal.ComponentManager.prototype.getComponentsByType= function(compName) {
	if(this.hasComponentType(compName))
		return this.getComponentMap(this.getComponentIndex(compName));
	return null;
};

/**
 * Sets the component bit in the entity compostion for the component type
 * @param {number} entityId The entity Id
 * @param {(number|string)} compType The component type - can be the index or the name of the component
 */
CrunchJS.Internal.ComponentManager.prototype.setComponentBit = function(entityId, compType) {
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
CrunchJS.Internal.ComponentManager.prototype.clearComponentBit = function(entityId, compType) {
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
CrunchJS.Internal.ComponentManager.prototype.hasComponentBit = function(entityId, compType) {
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
CrunchJS.Internal.ComponentManager.prototype.getEntityComposition = function(entityId) {
	return this._entityCompostitions[entityId];
}

/**
 * Sets the entity Composition bitset
 * @param {number} entityId The entity Id
 * @param {Array} bitset   The bitset
 */
CrunchJS.Internal.ComponentManager.prototype.setEntityComposition = function(entityId, bitset) {
	this._entityCompostitions[entityId] = bitset;
};

/**
 * Returns true if the manager is tracking the component of that type
 * @param  {String}  type The name of the component
 * @return {Boolean}      True if the manager has seen a component of that type
 */
CrunchJS.Internal.ComponentManager.prototype.hasComponentType = function(type) {
	return this._compIndecies.containsKey(type);
};

/**
 * Gets the Component Index
 * @param  {String} componentName The component Name
 * @return {number}               The index
 */
CrunchJS.Internal.ComponentManager.prototype.getComponentIndex = function(componentName) {
	return this._compIndecies.get(componentName);
};

/**
 * Removes all of the components from the entity
 * @param  {number} entityId The entity id
 */
CrunchJS.Internal.ComponentManager.prototype.removeAllComponents = function(entityId) {
	
	this._removeAllComponents(entityId);

	this.getScene().postEventToRemoteEngine(CrunchJS.EngineCommands.RemoveAllComponents, entityId);

};

CrunchJS.Internal.ComponentManager.prototype._removeAllComponents = function(entityId) {
	var composition = this.getEntityComposition(entityId),
		len = this.bitSetOperator.length(composition);

	for(var i = 0; i<len; i++){
		
		// If the bit is set, remove the component
		if(this.bitSetOperator.get(composition, i)){
			this.getComponentMap(i).remove(entityId);
			this.bitSetOperator.clear(composition, i);
		}
	}


	this.getScene().fireEvent(CrunchJS.Events.EntityChanged, entityId);
};

/**
 * Called when an entity is created
 * @param  {number} entityId The entityId
 */
CrunchJS.Internal.ComponentManager.prototype.entityCreated = function(entityId) {
	this._entityCompostitions[entityId] = this.bitSetOperator.createBitSet();
}; 

/**
 * Called when an entity is destroyed
 * @param  {number} entityId The entity id
 */
CrunchJS.Internal.ComponentManager.prototype.entityDestroyed = function(entityId) {
	this._destroyedEntities.add(entityId);
};

/**
 * Called whenever component data is changed so it can sync
 * @param  {Object} data The event data
 */
CrunchJS.Internal.ComponentManager.prototype.componentUpdated = function(data) {
	this.getScene().postEventToRemoteEngine(CrunchJS.EngineCommands.UpdateComponent, {
		'id' : data.entityId,
		'comp' : this.serialize(this.getComponent(data.entityId, data.compName))
	});
};

/**
 * Returns a serializable object
 * @param  {Object} obj The object to transform
 * @return {Object}     The transformed object
 */
CrunchJS.Internal.ComponentManager.prototype.serialize = function(obj) {
	var serData = {},
		transVal;

	serData.__functions = {};
	goog.array.forEach(Object.getOwnPropertyNames(obj), function(name) {
		transVal = obj[name];

		if(goog.isFunction(transVal)){
			transVal = transVal.toString();
			serData.__functions[name] = transVal;
		}
		else{
			// If it inherits from something, serialize that too
			if(goog.isObject(transVal) && transVal.__proto__.__proto__){
				serData[name] = this.serialize(transVal);
			}
			else
				serData[name] = transVal;
		}
	}, this);	

	// Serialize the proto if not the last proto
	if(obj.__proto__.__proto__)
		serData.__prototype = this.serialize(obj.__proto__); 

	return serData;
};

/**
 * Deserializes the object
 * @param  {Object} obj The object to deserialize 
 * @return {Object}     The deserialized object
 */
CrunchJS.Internal.ComponentManager.prototype.deserialize = function(obj) {
	var data;

	if(!goog.isDefAndNotNull(obj) || !goog.isObject(obj))
		return obj;

	if(obj.__prototype){
		data = Object.create(this.deserialize(obj.__prototype));
		delete obj.__prototype;
	}
	else
		data = {};

	goog.object.forEach(obj.__functions, function(funString, funKey) {
		data[funKey] = eval('var fun = ' + funString + '; fun;');
	});

	goog.object.forEach(obj, function(val, key) {
		data[key] = this.deserialize(val);
	}, this);	

	return data;
};

/**
 * Gets a snapshot of the current state of all of the components
 * @return {Object} The state
 */
CrunchJS.Internal.ComponentManager.prototype.getSnapshot = function() {
	var data = {};

	data._compIndecies = this._compIndecies.toObject();

	data._componentMaps = goog.array.map(this._componentMaps, function(el, index) {
		return el.toObject();
	});

	data._entityCompostitions= this._entityCompostitions;

	data._destroyedEntities = this._destroyedEntities.getValues();

	return data;
};

/**
 * Overwrites the current state with the incoming state
 * @param  {Object} data The new state
 */
CrunchJS.Internal.ComponentManager.prototype.sync = function(data) {
	this._compIndecies = new goog.structs.Map(data._compIndecies);
	this._componentMaps = goog.array.map(data._componentMaps, function(el, index) {
		return new goog.structs.Map(el);
	});

	this._entityCompostitions = data._entityCompostitions;

	this._destroyedEntities = new goog.structs.Set(data._destroyedEntities);
};

/**
 * Cleans up the destroyed entitites
 */
CrunchJS.Internal.ComponentManager.prototype.clean = function() {
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
