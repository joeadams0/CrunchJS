/**
 * @author Joe Adams
 */


goog.provide('CrunchJS.Scene');

goog.require('CrunchJS.Internal.SystemManager');
goog.require('CrunchJS.Internal.EntityManager');
goog.require('CrunchJS.Internal.ComponentManager');
goog.require('CrunchJS.Internal.EventManager');
goog.require('CrunchJS.Internal.NetworkManager');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');

goog.require('goog.object');

/**
 * Constructs a new Scene. This class is meant to be extended so that you can override 
 * the activate and deactivate methods to perform any loading or unloading as you see fit.
 * ALWAYS set the name field to the name of the class. 
 * @constructor
 * @class The Scene Class
 * @extends {CrunchJS.Internal.EventManager}
 *
 * @example
 *
 * goog.require('CrunchJS.Scene');
 * 
 * var ExampleScene = function() {
 * 	// Initialize here
 * }
 *
 * goog.inherits(ExampleScene, CrunchJS.Scene);
 * 
 * ExampleScene.prototype.name = "ExampleScene";
 *
 * ExampleScene.prototype.activate = function(data){
 * 	// Call super method
 * 	goog.base(this, 'activate', data)
 * 	
 * 	// Load assets here
 * }
 *
 * Example Scene.prototype.deactivate = function(){
 * 	// Call super method	
 * 	goog.base(this, 'deactivate');
 * 	
 * 	// Unload assets here
 * }
 *
 * var scene = new ExampleScene();
 *
 * var world = new CrunchJS.World();
 *
 * world.addScene(scene);
 */
CrunchJS.Scene = function() {
	goog.base(this);

	/**
	 * True when the scene is active
	 * @type {Boolean}
	 * @protected
	 */
	this._isActive = false;

	/**
	 * The SystemManager for the scene
	 * @type {CrunchJS.Internal.SystemManager}
	 * @protected
	 */
	this._systemManager = new CrunchJS.Internal.SystemManager(this);

	/**
	 * The EntityManager for the scene
	 * @type {CrunchJS.Internal.EntityManager}
	 * @protected
	 */
	this._entityManager = new CrunchJS.Internal.EntityManager(this);

	/**
	 * The ComponentManager for the scene
	 * @type {CrunchJS.Internal.ComponentManager}
	 * @protected
	 */
	this._componentManager = new CrunchJS.Internal.ComponentManager(this);

	/**
	 * The NetworkManager for the scene
	 * @type {CrunchJS.Internal.NetworkManager}
	 * @protected
	 */
	this._networkManager = new CrunchJS.Internal.NetworkManager(this);
	
	/**
	 * The remote engine for the web worker 
	 * @type {CrunchJS.Network.RemoteSystem.WWRemoteEngine}
	 * @private
	 */
	this._sim = null;


	// Events incoming
	this.addEventListener(CrunchJS.EngineCommands.Run, goog.bind(CrunchJS.world.run, CrunchJS.world));
	this.addEventListener(CrunchJS.EngineCommands.Pause, goog.bind(CrunchJS.world.pause, CrunchJS.world));
	this.addEventListener(CrunchJS.EngineCommands.Sync, goog.bind(this.onSync, this));
	this.addEventListener(CrunchJS.EngineCommands.SyncRequest, goog.bind(this.onSyncRequest, this));

	// Events that should be forwarded to the sim
	this.addEventListener(CrunchJS.Events.Started, goog.bind(function() {
		this.postEventToRemoteEngine(CrunchJS.EngineCommands.Run);
	}, this));

	this.addEventListener(CrunchJS.Events.Paused, goog.bind(function() {
		this.postEventToRemoteEngine(CrunchJS.EngineCommands.Pause);
	}, this));

	this.addEventListener(CrunchJS.Events.SendCommand, goog.bind(this.onSendCommand, this));

};

goog.inherits(CrunchJS.Scene, CrunchJS.Internal.EventManager);

/**
 * Called when the scene is activated. Made to be overwritten, but should call super in overwritten method.
 * @param {Object=} data Optional data that may be passed in
 */
CrunchJS.Scene.prototype.activate = function(data) {
	this.log('Activating ' + this.name, CrunchJS.LogLevels.DEBUG);
	this._isActive = true;

	this._entityManager.activate();
	this._componentManager.activate();
	this._systemManager.activate();
	this._networkManager.activate();
};

/**
 * Called when the scene is deactivated. Made to be overwritten, but should call super in overwritten method.
 */
CrunchJS.Scene.prototype.deactivate = function() {
	console.log('Deactivating ', this.name);	
	this._isActive = false;

	this._entityManager.deactivate();
	this._componentManager.deactivate();
	this._systemManager.deactivate();
	this._networkManager.deactivate();
};

/**
 * Checks if the scene is currently active
 * @return {Boolean} True if the scene is currently active
 */
CrunchJS.Scene.prototype.isActive = function() {
	return this._isActive;
};

/**
 * Checks if the scene has a simulation
 * @return {Boolean} True if the scene has a simulation
 */
CrunchJS.Scene.prototype.hasSim = function() {
	return this._sim != null;
}; 

/**
 * Processes the current Scene
 * @param  {CrunchJS.Frame} frame The current frame
 */
CrunchJS.Scene.prototype.process = function(frame) {
	this._systemManager.process(frame);
	this._componentManager.clean();
};

/**
 * Adds a system to the scene. The order that systems are added to the engine is the order the will be updated in.
 * @param {CrunchJS.Internal.System} system The System to add to the CrunchJS
 * @final
 * 
 */
CrunchJS.Scene.prototype.addSystem = function(system) {
	this._systemManager.addSystem(system);
};

/** 
 * Removes the system from the world.	
 * @final
 * @param  {string} systemName The system identifier
 */
CrunchJS.Scene.prototype.removeSystem = function(systemName) {
	this._systemManager.removeSystem(systemName)
};

/**
 * Creates an entity 
 * @return {number} The id of the Entity
 * @this {CrunchJS.Scene}
 * @final
 */
CrunchJS.Scene.prototype.createEntity = function() {
	return this._entityManager.createEntity();
};

/**
 * Destroys the entity
 * @param  {number} entityId The Entity Id
 * @this {CrunchJS.Scene}
 * @final
 */
CrunchJS.Scene.prototype.destroyEntity = function(entityId) {
	return this._entityManager.destroyEntity(entityId);
};

/**
 * Checks if an entity matches an entity composition
 * @param  {number} entityId The entity id
 * @param  {CrunchJS.Internal.EntityComposition} entComp  The entity composition
 * @return {Boolean}          True if it matches the composition
 */
CrunchJS.Scene.prototype.matchesComposition = function(entityId, entComp) {
	return this._componentManager.matchesComposition(entityId, entComp);
};

/**
 * Enables an entity
 * @param  {number} entityId The entity id
 */
CrunchJS.Scene.prototype.enableEntity = function(entityId) {
	this._entityManager.enableEntity(entityId);
};

/**
 * Disables an entity
 * @param  {number} entityId The entity id
 */
CrunchJS.Scene.prototype.disableEntity = function(entityId) {
	return this._entityManager.disableEntity(entityId);
};

/**
 * Sets a name for the entityId
 * @param {string} name     The name to set
 * @param {number} entityId The entityId
 */
CrunchJS.Scene.prototype.setEntityName = function(name, entityId) {
	this._entityManager.setEntityName(name, entityId, true);	
};

/**
 * Gets the entity from its name, if it has one
 * @param  {string} name The name of the entity
 * @return {number}      The entityId
 */
CrunchJS.Scene.prototype.getEntityByName = function(name) {
	return this._entityManager.getEntityByName(name);
};

/**
 * Adds a component to the entity corresponding to the given id.
 * @param {Number} entityId  The Entity Id
 * @param {CrunchJS.Internal.Component} component The Component to add
 * @final
 */
CrunchJS.Scene.prototype.addComponent = function(entityId, component) {
	return this._componentManager.addComponent(entityId, component);
}

/**
 * Removes the component from the entity
 * @final
 * @param  {Number} entityId            The entity id
 * @param  {string} compName The component id
 */
CrunchJS.Scene.prototype.removeComponent = function(entityId, compName) {
	return this._componentManager.removeComponent(entityId, compName);
};

/**
 * Removes all of the components from an entity
 * @param  {number} entityId The entity id
 */
CrunchJS.Scene.prototype.removeAllComponents = function(entityId) {
	this._componentManager.removeAllComponents(entityId);
};

/**
 * Finds the Component with compName in the Entity with entityId
 * @param  {Number} entityId The Entity Id
 * @param  {String} compName The Component Name
 * @return {Component=}       The Component or null if there is no Component with the given name
 */
CrunchJS.Scene.prototype.getComponent = function(entityId, compName) {
	return this._componentManager.getComponent(entityId, compName);
};

/**
 * Returns all of the Components for an entity in an Array
 * @param  {Number} entityId The Entity Id
 * @return {Array}           The Array of Components
 */
CrunchJS.Scene.prototype.getComponents = function(entityId) {
	return this._componentManager.getComponents(entityId);
};

/**
 * Finds all of the active entities for a certain composition
 * @param  {CrunchJS.EntityComposition} entityComp The entity composition
 * @return {goog.structs.Set()}            A set of the entity ids
 */
CrunchJS.Scene.prototype.findEntities = function(entityComp) {
	return this._componentManager.findEntities(entityComp);
};

/**
 * Gets all of the components of a single type
 * @param  {String} compName The Component name
 * @return {goog.structs.Map}          A map of entity ids -> components
 */
CrunchJS.Scene.prototype.getComponentsByType = function(compName) {
	return this._componentManager.getComponentsByType(compName);
};

/**
 * Sets the simulation remote engine holding the simulation
 * @param {CrunchJS.Network.RemoteEngine.WWRemoteEngine} sim The remote engine holding the simulation
 */
CrunchJS.Scene.prototype.setSimulation = function(sim) {
	this._sim = sim;

	this.fireEvent(CrunchJS.Events.SimAdded);

	this.onSyncRequest();

	if(CrunchJS.world.isRunning()){
		// Send running event
		this._sim.run();
	}

};

/**
 * Remove the simulation
 */
CrunchJS.Scene.prototype.removeSimulation = function() {
	this._sim = null;

	this.fireEvent(CrunchJS.Events.SimRemoved);
};

/**
 * Gets the current simulation of there is one
 * @return {WebWorker} The Simulation
 */
CrunchJS.Scene.prototype.getSim = function() {
	return this._sim;
};

/**
 * Overwrites the current data with the new data
 * @param  {Object} data The new data
 */
CrunchJS.Scene.prototype.onSync = function(data) {
	CrunchJS.world.log('Syncing');

	this._entityManager.sync(data.entityManager);
	this._componentManager.sync(data.componentManager);

	this.fireEvent(CrunchJS.Events.RefreshData);
};

/**
 * Sends the current entities and components
 */
CrunchJS.Scene.prototype.onSyncRequest = function() {
	this.postEventToRemoteEngine(CrunchJS.EngineCommands.Sync, this.getSnapshot());
};

/**
 * Gets a snapshot of the current scene
 * @return {Object} The snapshot
 */
CrunchJS.Scene.prototype.getSnapshot = function() {
	var data = {};

	data.entityManager = this._entityManager.getSnapshot();
	data.componentManager = this._componentManager.getSnapshot();

	return data;
};
/**
 * Listens for the send command event
 * @param  {Object} data The event data
 */
CrunchJS.Scene.prototype.onSendCommand = function(data) {
	if(this.hasSim()){
		this.getSim().postEvent(data.eventName, data.data);
	}
	else if(CrunchJS.world.isSim()){
		CrunchJS.world.getMainEngine().postEvent(data.eventName, data.data);
	}
};

/**
 * Creates a new entity composition used to search the entity space for interesting entities
 * @return {CrunchJS.Internal.EntityComposition} The Composition
 */
CrunchJS.Scene.prototype.createEntityComposition = function() {
	return this._componentManager.createEntityComposition();
};

/**
 * Posts an event to the remote engine
 * @param  {string} eventName The event name
 * @param  {Object} data      The data to pass
 */
CrunchJS.Scene.prototype.postEventToRemoteEngine = function(eventName, data){
	var event = {
		eventName : eventName,
		data : data
	};

	this.fireEvent(CrunchJS.Events.SendCommand, event);
};

/**
 * Gets the number of entities
 * @return {number} The number of entities
 */
CrunchJS.Scene.prototype.getEntityCount = function() {
	return this._entityManager.entities;
};

/**
 * Gets the number of active entities
 * @return {number} The number of active entities
 */
CrunchJS.Scene.prototype.getActiveCount = function() {
	return this._entityManager.actives;
};
/**
 * Logs a message
 * @param  {Object} message The object to log
 * @param  {CrunchJS.LogLevel} level   The log level
 */
CrunchJS.Scene.prototype.log = function(message, level) {
	CrunchJS.world.log(message, level);
};

