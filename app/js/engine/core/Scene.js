/**
 * @author Joe Adams
 */


goog.provide('CrunchJS.Scene');

goog.require('CrunchJS.Internal.SystemManager');
goog.require('CrunchJS.Internal.EntityManager');
goog.require('CrunchJS.Internal.ComponentManager');
goog.require('CrunchJS.Internal.EventManager');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');

/**
 * Constructs a new Scene. This class is meant to be extended so that you can override 
 * the activate and deactivate methods to perform any loading or unloading as you see fit.
 * ALWAYS set the name field to the name of the class. 
 * @constructor
 * @class The Scene Class
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
	/**
	 * True when the scene is active
	 * @type {Boolean}
	 * @protected
	 */
	this._isActive = false;

	/**
	 * The EventManager for the scene
	 * @type {CrunchJS.Internal.EventManager}
	 * @protected
	 */
	this._eventManager = new CrunchJS.Internal.EventManager(this);

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
	 * The channel to communicate to the simulation
	 * @type {CrunchJS.IChannel}
	 * @private
	 */
	this._simChannel = null;

	/**
	 * The web worker simulation
	 * @type {Worker}
	 * @private
	 */
	this._sim = null;


};

/**
 * Called when the scene is activated. Made to be overwritten, but should call super in overwritten method.
 * @param {Object=} data Optional data that may be passed in
 */
CrunchJS.Scene.prototype.activate = function(data) {
	console.log('Activating ', this.name);
	this._isActive = true;

	this._systemManager.activate();
};

/**
 * Called when the scene is deactivated. Made to be overwritten, but should call super in overwritten method.
 */
CrunchJS.Scene.prototype.deactivate = function() {
	console.log('Deactivating ', this.name);	
	this._isActive = false;
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
	return this.sim != null;
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
 * Gets all of the components of a single type
 * @param  {String} compName The Component name
 * @return {goog.structs.Map}          A map of entity ids -> components
 */
CrunchJS.Scene.prototype.getComponentsByType = function(compName) {
	return this._componentManager.getComponentsByType(compName);
};

/**
 * Add a listener for an event
 * @param {String} eventName The name of the event
 * @param {Function} fun       The function to call when the event is heard
 */
CrunchJS.Scene.prototype.addListener = function(eventName, fun) {
	this._eventManager.addListener(eventName, fun);
};

/**
 * Removes a listener from an event
 * @param  {String} eventName The name of the event
 * @param  {Function} fun       The function to remove
 */
CrunchJS.Scene.prototype.removeListener = function(eventName, fun) {
	this._eventManager.removeListener(eventName, fun);
};

/**
 * Returns an array of listeners for the event
 * @param  {String} eventName The name of the event
 * @return {Array<Function>}           The array of listeners
 */
CrunchJS.Scene.prototype.getListeners = function(eventName) {
	return this._eventManager.getListeners(eventName);
};

/**
 * Removes all the listeners from an event
 * @param  {String} eventName The name of the event */
CrunchJS.Scene.prototype.removeAllListeners = function(eventName){
	this._eventManager.removeAllListeners(eventName);
}

/**
 * Fires an event
 * @param  {String} eventName The name of the event to fire
 * @param  {Object} eventData The event object
 */
CrunchJS.Scene.prototype.fireEvent = function(eventName, eventData) {
	this._eventManager.fireEvent(eventName, eventData);
};

/**
 * Sets the channel to talk to the simulation
 * @param {CrunchJS.IChannel} channel The chanel 
 */
CrunchJS.Scene.prototype.setSimChannel = function(channel) {
	this._simChannel = channel;
};

/**
 * Gets the current simulation channel if there is one
 * @return {CrunchJS.IChannel} The Simulation channel
 */
CrunchJS.Scene.prototype.getSimChannel = function() {
	return this._simChannel;
};

/**
 * Sets the simulation and creates the WebWorkerChannel to communicate to the simulation.
 * @param {Worker} sim The WebWorker that the simulation is running in
 */
CrunchJS.Scene.prototype.setSimulation = function(sim) {
	this._sim = sim;

	var channel = new CrunchJS.Network.Channel.WebWorkerChannel(sim);

	this.setSimChannel(channel);

};

/**
 * Gets the current simulation of there is one
 * @return {WebWorker} The Simulation
 */
CrunchJS.Scene.prototype.getSim = function() {
	return this._sim;
};

/**
 * Creates a new entity composition used to search the entity space for interesting entities
 * @return {CrunchJS.Internal.EntityComposition} The Composition
 */
CrunchJS.Scene.prototype.createEntityComposition = function() {
	return this._componentManager.createEntityComposition();
};

