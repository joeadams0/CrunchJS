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
 * Creates a new instance of the Core Engine. Should be a singleton, global access at Engine.engine.
 * @param {(Object|string)=} config The configurations for the engine.
 * @param {Number=} config.fps The frames per second to run at. Usually leave this undefined so that the engine can pick the optimal rate.
 * @param {Engine.Renderer} config.renderer The renderer for the engine. If this is left undefined, the engine will become a simulation.
 * @class The Game Engine Object
 * @constructor
 * @this {Engine.Core}
 *
 * @example
 * // Create an engine that uses a webworker for the simulation
 * var engine = new Engine.Core();
 */
Engine.Core = function(config) {
	// Private vars

	/**
	 * Manages the System
	 * @type {Engine.SystemManager}
	 * @private
	 */
	this.systemManager = null;

	/**
	 * Manages the Entities
	 * @type {Engine.EntityManager}
	 * @private
	 */
	this.entityManager = null;

	/**
	 * Manages the frames
	 * @type {Engine.FrameManager}
	 * @private
	 */
	this.frameManager = null;
	
	/**
	 * The clock for the updates
	 * @type {goog.Timer}
	 * @private
	 */
	this._clock = null;

	// Public vars 
	
	/**
	 * The Engine configs	
	 * @type {Object}
	 * @public
	 */
	this.config = null;

	/**
	 * True if the engine is a simulation
	 * @type {Boolean}
	 * @public
	 */
	this.isSim = false;

	/**
	 * The web worker simulation
	 * @type {Worker}
	 */
	this.sim = null;

	/**
	 * Is the engine running
	 * @type {Boolean}
	 * @public
	 */
	this.isRunning = false;

	/**
	 * The chanel to the main engine. Null if not in a simulation
	 * @type {Engine.IChannel}
	 * @public
	 */
	this.mainChannel = null;

	/**
	 * The channel to communicate to the simulation
	 * @type {Engine.IChannel	}
	 */
	this.simChannel = null;





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
		 * The renderer for the game
		 * @type {Engine.Renderer}
		 */
		renderer : null

	};

	if(config == undefined)
		config = {};
	
	// Copy default values if passed in config has empty fields
	goog.object.forEach(defaultConfigs, function(el, index, object) {
		if(!goog.object.containsKey(config, index)){
			goog.object.set(config, index, el);
		}
	});

	this.config = config;

	
	this.isSim = !goog.isDefAndNotNull(this.config.renderer);

	// Create the main channel if a sim and if in a webworker
	if(this.isSim){
		if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
		    
			var channel = new Engine.WebWorkerChannel();

			this.setMainChannel(channel);

		}
	}
	

	this.systemManager = new Engine.SystemManager();
	this.entityManager = new Engine.EntityManager();
	this.frameManager = new Engine.FrameManager();

	this._clock = new goog.Timer(1000/config.fps);


	// Step the engine on each tick
	goog.events.listen(this._clock, goog.Timer.TICK, goog.bind(this.step, this));


	goog.provide('Engine.engine');
	
	/**
	 * The instance of the engine
	 * @type {Engine.Core}
	 */
	Engine.engine = this;

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

/**
 * Adds a channel to talk to the Main Window
 * @param {Engine.IChannel} channel The Channel to add
 */
Engine.Core.prototype.setMainChannel = function(channel) {
	this.mainChannel = channel;
};

/**
 * Sets the channel to talk to the simulation
 * @param {Engine.IChannel} channel The chanel 
 */
Engine.Core.prototype.setSimChannel = function(channel) {
	this.simChannel = channel;
};

/**
 * Sets the simulation and creates the WebWorkerChannel to communicate to the simulation. Only works if not in a simulation currently.
 * @param {Worker} sim The WebWorker that the simulation is running in
 */
Engine.Core.prototype.setSimulation = function(sim) {
	if(!this.isSim){
		this.sim = sim;

		var channel = new Engine.WebWorkerChannel(sim);

		this.setSimChannel(channel);
	}

};

