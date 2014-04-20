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
goog.require('goog.string');


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

	this._compConstructors = new goog.structs.Map();

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

	// The updates to send at the end of the frame
	this.updates = {
		addRemove : new goog.structs.Map(),
		updatedComponents : new goog.structs.Map()
	}
	


	// Listen for external commands
	this.getScene().addEventListener(CrunchJS.Events.EntityCreated, goog.bind(this.entityCreated,this));
	this.getScene().addEventListener(CrunchJS.Events.EntityDestroyed, goog.bind(this.entityDestroyed,this));
	this.getScene().addEventListener(CrunchJS.Events.ComponentUpdated, goog.bind(this.componentUpdated,this));

	this.getScene().addEventListener(CrunchJS.EngineCommands.UpdateComponents, goog.bind(this.update, this));
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

	this.getComponent(data.id, data.comp.name).update(data.comp.comp);
};


/**
 * Adds a component from a remote engine
 * @param  {Object} data The data from the remote engine
 */
CrunchJS.Internal.ComponentManager.prototype.onAddComponent = function(data) {
	if(CrunchJS.DATA_SYNC_DEBUG)
		CrunchJS.world.log('Add component: '+ JSON.stringify(data));
	this._setComponent(data.id, this.deserializeComponent(data.comp));
};

/**
 * Remove a component command from a remote engine
 * @param  {Object} data The data from the remote engine
 */
CrunchJS.Internal.ComponentManager.prototype.onRemoveComponent = function(data) {
	if(CrunchJS.DATA_SYNC_DEBUG)
		CrunchJS.world.log('Remove component: '+ JSON.stringify(data));
	this._removeComponent(data.id, data.compName);
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
 * Registers the component with the manager. Do this for all components at the beginning of the scene
 * @param  {Function} constr The constructor for the component. Make sure the name property is specifed
 */
CrunchJS.Internal.ComponentManager.prototype.registerComponent = function(constr) {
	this.createComponentType(constr.prototype.name);
	this.setConstructor(constr.prototype.name, constr);
};

/**
 * Sets the constructor for the name
 * @param {String} name The name of the type of component
 * @param {Function} ctor The constructor for the component
 */
CrunchJS.Internal.ComponentManager.prototype.setConstructor = function(name, ctor) {
	this._compConstructors.set(name, ctor);
};

/**
 * Gets the constructor for the type of component
 * @param  {String} name The name of the type of component
 * @return {Function}      The constructor
 */
CrunchJS.Internal.ComponentManager.prototype.getConstructor = function(name) {
	return this._compConstructors.get(name);
};


/**
 * Adds a component to an entity
 * @param {number} entityId  The entity id
 * @param {CrunchJS.Internal.Component} component The component to add
 */
CrunchJS.Internal.ComponentManager.prototype.addComponent = function(entityId, component) {
	this._setComponent(entityId, component);

	this.addRemoveUpdate(entityId, component.name);
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

	component.setScene(this.getScene());

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
		this.addRemoveUpdate(entityId, componentName);
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

		
		success = compMap.remove(entityId);

		if(success){
			comp.setScene(null);
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
		if(comp && this.matchesComposition(id, entityComposition))
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
 * @param  {Number} entityId The entity id
 */
CrunchJS.Internal.ComponentManager.prototype.removeAllComponents = function(entityId) {
	this._removeAllComponents(entityId);


	this.getScene().fireEvent(CrunchJS.Events.EntityChanged, entityId);
};

CrunchJS.Internal.ComponentManager.prototype._removeAllComponents = function(entityId) {
	var composition = this.getEntityComposition(entityId),
		len = this.bitSetOperator.length(composition);

	var newMap = this._compIndecies.transpose();

	for(var i = 0; i<len; i++){
		
		// If the bit is set, remove the component
		if(this.bitSetOperator.get(composition, i)){
			this.getComponentMap(i).remove(entityId);
			this.bitSetOperator.clear(composition, i);

			this.addRemoveUpdate(entityId, newMap.get(i));
		}
	}
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
	this.addUpdatedComp(data.entityId, data.compName);
};

/**
 * Adds a component to the add remove component list so that we can send them at the end of the frame.
 * @param {Numebr} id   The id of the entity
 * @param {String} name The name of the component to add or remove
 */
CrunchJS.Internal.ComponentManager.prototype.addRemoveUpdate = function(id, name) {
	if(!this.updates.addRemove.containsKey(id)){
		this.updates.addRemove.set(id, new goog.structs.Set());
	}

	this.updates.addRemove.get(id).add(name);
};

/**
 * Adds an updated component to the updates object so we can send it at the end of the frame
 * @param {Number} id   The entity Id
 * @param {String} name The name of the component
 */
CrunchJS.Internal.ComponentManager.prototype.addUpdatedComp = function(id, name) {
	if(!this.updates.updatedComponents.containsKey(id))
		this.updates.updatedComponents.set(id, new goog.structs.Set());


	if(!this.updates.addRemove.containsKey(id) || !this.updates.addRemove.get(id).contains(name))
		this.updates.updatedComponents.get(id).add(name);
};

/**
 * Returns a serializable object for a component
 * @param  {CrunchJS.Component} obj The component to transform
 * @param {Boolean} onlyUpdates if true, the object will only contain the updated data
 * @return {Object}     The transformed object
 */
CrunchJS.Internal.ComponentManager.prototype.serializeComponent = function(comp, onlyUpdates) {
	var data = {};

	data.name = comp.name;

	if(onlyUpdates)
		data.comp = comp.getUpdates();
	else
		data.comp = comp.toObj();

	return data;
};

/**
 * Deserializes a Components object
 * @param  {Object} obj The object to deserialize 
 * @return {CrunchJS.Component}     The Component
 */
CrunchJS.Internal.ComponentManager.prototype.deserializeComponent = function(obj) {
	var constr = this.getConstructor(obj.name);

	var o = constr.fromObj(obj.comp);

	o.setScene(this.getScene());
	
	return o;
};

/**
 * Gets a snapshot of the current state of all of the components
 * @return {Object} The state
 */
CrunchJS.Internal.ComponentManager.prototype.getSnapshot = function() {
	var data = {};

	data._componentMaps = goog.array.map(this._componentMaps, function(el, index) {
		return goog.structs.map(el, function(comp) {
			return this.serializeComponent(comp);
		},this);
	}, this);

	data._entityCompostitions = this._entityCompostitions;

	data._destroyedEntities = this._destroyedEntities.getValues();

	return data;
};

/**
 * Overwrites the current state with the incoming state
 * @param  {Object} data The new state
 */
CrunchJS.Internal.ComponentManager.prototype.sync = function(data) {
	
	this._componentMaps = goog.array.map(data._componentMaps, function(el, index) {
		return new goog.structs.Map(goog.object.map(el, function(comp) {
			return this.deserializeComponent(comp);
		}, this));
	}, this);

	this._entityCompostitions = data._entityCompostitions;

	this._destroyedEntities = new goog.structs.Set(data._destroyedEntities);
};

/**
 * Gets the updates for the frame, then resets the updates
 * @return {Object} The updates
 */
CrunchJS.Internal.ComponentManager.prototype.getUpdates = function() {
	var updates = {};
	
	// Send all of the components to add or remove
	updates.addRemove = goog.structs.map(this.updates.addRemove, function(set, id) {
		
		return goog.structs.map(set, function(name) {

			// Send the component if it has it
			if(this.hasComponent(id, name)){
				var comp = this.getComponent(id, name);
				comp.resetUpdates();

				return this.serializeComponent(comp);
			}

			// Else send null to signify that it hase been removed
			return {
				name : name,
				comp : null
			};

		}, this);
	}, this);

	// Send all of the components to update 
	updates.updatedComponents = goog.structs.map(this.updates.updatedComponents, function(set ,id) {

		return goog.structs.map(
			goog.structs.filter(set, function(name) {
				return this.hasComponent(id, name);
			}, this), 
			function(name) {
				var comp = this.getComponent(id, name),
					data = comp.getUpdates();

				comp.resetUpdates();

				return {
					name : name,
					data : data
				};

			}, 
		this);

	}, this);

	return updates;
};

/**
 * Update the components with the new data 
 * @param  {Object} obj The new data
 */
CrunchJS.Internal.ComponentManager.prototype.update = function(obj) {

	goog.object.forEach(obj.addRemove, function(comps, id) {

		id = goog.string.parseInt(id, 10);
		goog.array.forEach(comps, function(comp) {

			// If the components are null, remove them
			if(comp.comp == null)
				this._removeComponent(id, comp.name);
			// Else deserialize and add
			else
				this._setComponent(id, this.deserializeComponent(comp));

		}, this);

	}, this);

	goog.object.forEach(obj.updatedComponents, function(comps, id) {

		goog.array.forEach(comps, function(comp) {
			// Update each one with the data
			this.getComponent(id, comp.name).update(comp.data);

		}, this);

	}, this);
};


/**
 * Cleans up the destroyed entitites
 */
CrunchJS.Internal.ComponentManager.prototype.clean = function() {

	this._destroyedEntities.clear();

	this.updates.addRemove.clear();
	this.updates.updatedComponents.clear();
};
