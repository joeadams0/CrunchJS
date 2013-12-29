/**
 * @author Joe Adams
 */

goog.provide('Engine.Core');

goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.object');

goog.require('Engine.SystemManager');
goog.require('Engine.EntityManager');
goog.require('Engine.FrameManager');

/**
 * Creates a new instance of the Core Engine
 * @param {(Object|string)=} config The configurations for the engine.
 * @param {Number=} config.fps The frames per second to run at. Usually leave this undefined so that the engine can pick the optimal rate.
 * 
 * @class The Game Engine object
 * @constructor
 * @this {Engine.Core}
 *
 * @example
 * // Create an engine that uses a webworker for the simulation
 * var engine = new Engine.Core();
 */
Engine.Core = function(config) {
	/**
	 * The Default Configurations
	 * @type {Object}
	 */
	var defaultConfigs = {
		/**
		 * The FPS of the Engine
		 * @type {Number}
		 */
		fps : 60,

		/**
		 * Whether to use a web worker for the simulation
		 * @type {Boolean}
		 */
		webworker : true
	};

	// Copy default values if passed in config has empty fields
	goog.object.forEach(defaultConfigs, function(el, index, object) {
		if(!goog.object.containsKey(config, index)){
			goog.object.set(config, index, el);
		}
	});


	// Manages the Systems
	this.systemManager = new Engine.SystemManager();

	// Manages the Entities
	this.entityManager = new Engine.EntityManager();

	// Manages the Frames
	this.frameManager = new Engine.FrameManager();

	/**
	 * Is the engine running
	 * @type {Boolean}
	 */
	this.isRunning = false;

	

	/**
	 * The clock for the updates
	 * @type {goog.Timer}
	 * @private
	 */
	this._clock = new goog.Timer(1000/config.fps);


	// Step the engine on each tick
	goog.events.listen(this._clock, goog.Timer.TICK, goog.bind(this.step, this));

	return this;
};

/**
 * Runs the engine. After this is called, all Systems will have update called every frame.
 * @final
 * @this {Engine.Core}
 */
Engine.Core.prototype.run = function() {
	this.isRunning = true;
	this._clock.start();
};

/**
 * Pauses the Engine. All Systems will not have their update function called.
 * @final
 * @this {Engine.Core}
 */
Engine.Core.prototype.pause = function() {
	this.isRunning = false;
	this._clock.start();
};

/**
 * Steps the engine forward by one frame. Useful for pausing, and then stepping through the simulationx.
 * @final
 */
Engine.Core.prototype.step = function() {
	var frame = this.frameManager.nextFrame();

	// Update all of the systems
	this.systemManager.update(frame);
};

/**
 * Adds a system to the world. The order that systems are added to the engine is the order the will be updated in.
 * @param {Engine.System} system The System to add to the Engine
 * @final
 * @example
 * // Create the engine
 * var engine = new Engine.Core();
 * 
 * // Create a simple system
 * 
 * // Then add it to the Engine
 * engine.addSystem(system);
 * 
 */
Engine.Core.prototype.addSystem = function(system) {
	this.systemManager.addSystem(system);
};

/** 
 * Removes the system from the world.	
 * @final
 * @param  {string} systemName The system identifier
 */
Engine.Core.prototype.removeSystem = function(systemName) {
	this.systemManager.removeSystem(systemName)
};

/**
 * Creates an entity 
 * @return {number} The id of the Entity
 * @this {Engine.Core}
 * @final
 * @example
 * // Create the engine
 * var engine = new Engine.Core();
 *
 * // Create a new entity
 * var entityId = engine.createEntity();
 */
Engine.Core.prototype.createEntity = function() {
	return this.entityManager.createEntity();
};

/**
 * Destroys the entity
 * @param  {number} entityId The Entity Id
 * @this {Engine.Core}
 * @final
 */
Engine.Core.prototype.destroyEntity = function(entityId) {
	return this.entityManager.destroyEntity(entityId);
};

/**
 * Adds a component to the entity corresponding to the given id.
 * @param {Number} entityId  The Entity Id
 * @param {Engine.Component} component The Component to add
 * @final
 *
 * @example
 * // Create the engine
 * var engine = new Engine.Core();
 *
 * // Create the component
 * var component = new Component1();
 *
 * // Create the Entity
 * var entityId = engine.createEntity();
 *
 * // Add Component to the entity
 * engine.addComponent(entityId, component);
 */
Engine.Core.prototype.addComponent = function(entityId, component) {
	return this.entityManager.addComponent(entityId, component);
}

/**
 * Removes the component from the entity
 * @final
 * @param  {Number} entityId            The entity id
 * @param  {string} compName The component id
 */
Engine.Core.prototype.removeComponent = function(entityId, compName) {
	return this.entityManager.removeComponent(entityId, compName);
};

/**
 * Finds the Component with compName in the Entity with entityId
 * @param  {Number} entityId The Entity Id
 * @param  {String} compName The Component Name
 * @return {Component=}       The Component or null if there is no Component with the given name
 */
Engine.Core.prototype.getComponent = function(entityId, compName) {
	return this.entityManager.getComponent(entityId, compName);
};

/**
 * Returns all of the Components for an entity in an Array
 * @param  {Number} entityId The Entity Id
 * @return {Array}           The Array of Components
 */
Engine.Core.prototype.getComponents = function(entityId) {
	return this.entityManager.getComponents(entityId);
};

