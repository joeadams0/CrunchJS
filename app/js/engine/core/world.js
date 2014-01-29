/**
 * @author Joe Adams
 */
goog.provide('CrunchJS');
goog.provide('CrunchJS.World');
goog.provide('CrunchJS.Events');
goog.provide('CrunchJS.DEBUG');

goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.object');

goog.require('CrunchJS.SceneManager');
goog.require('CrunchJS.FrameManager');
goog.require('CrunchJS.WebWorkerChannel');

/**
 * Global debug flag
 * @define {boolean} 
 */
CrunchJS.DEBUG = true;

/**
 * The engine wide events
 * @type {Object}
 * @enum
 */
CrunchJS.Events = {
	Started : 'engine_started',
	Paused : 'engine_paused',
	EntityCreated : 'entity_created',
	EntityDestroyed : 'entity_destroyed',
	EntityEnabled : 'entity_enabled',
	EntityDisabled : 'entity_disabled',
	EntityChanged : 'entity_changed',
	ComponentUpdated : 'component_updated'
};

/**
 * Creates a new instance of the World CrunchJS. Should be a singleton, global access at CrunchJS.world.
 * @param {(Object|string)=} config The configurations for the engine.
 * @param {Number=} config.fps The frames per second to run at. Usually leave this undefined so that the engine can pick the optimal rate.
 * @class The Game CrunchJS Object
 * @constructor
 * @this {CrunchJS.World}
 *
 * @example
 * // Create a world that uses a webworker for the simulation
 * var world = new CrunchJS.World();
 */
CrunchJS.World = function(config) {

	console.log("Debugging:", CrunchJS.DEBUG);

	goog.provide('CrunchJS.world');
	
	/**
	 * The instance of the engine
	 * @type {CrunchJS.World}
	 */
	CrunchJS.world = this;

	/**
	 * The clock for the updates
	 * @type {goog.Timer}
	 * @private
	 */
	this._clock = null;	

	/**
	 * True if the engine is a simulation
	 * @type {Boolean}
	 * @private
	 */
	this._isSim = true;

	/**
	 * Is the engine running
	 * @type {Boolean}
	 * @private
	 */
	this._isRunning = false;

	/**
	 * Manages the Scenes for the Game
	 * @type {CrunchJS.SceneManager}
	 * @private
	 */
	this._sceneManager = new CrunchJS.SceneManager();


	/**
	 * Manages the Frames for the game
	 * @type {CrunchJS.FrameManager}
	 * @private
	 */
	this._frameManager = new CrunchJS.FrameManager();


	// Public vars 
	
	/**
	 * The CrunchJS configs	
	 * @type {Object}
	 * @public
	 */
	this.config = null;

	/**
	 * Is the script running in a webworker
	 * @type {Boolean}
	 * @public
	 */
	this.isWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

	/**
	 * The chanel to the main engine. Null if not in a simulation
	 * @type {CrunchJS.IChannel}
	 * @public
	 */
	this.mainChannel = null;

	/**
	 * The Default Configurations
	 * @type {Object}
	 */
	var defaultConfigs = {
		/**
		 * The FPS of the CrunchJS
		 * @type {Number}
		 */
		fps : 60

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

	this._clock = new goog.Timer(1000/config.fps);


	// Step the engine on each tick
	goog.events.listen(this._clock, goog.Timer.TICK, goog.bind(this.step, this));

	
	// Create the main channel if a sim and if in a webworker
	if(this.isSim() && this.isWebWorker){
	    
		var channel = new CrunchJS.WebWorkerChannel();

		this.setMainChannel(channel);

		this.addListener(this.Commands.run, goog.bind(this.run, this));
		this.addListener(this.Commands.pause, goog.bind(this.pause, this));
		this.addListener(this.Commands.step, goog.bind(this.step, this));
	}

	return this;
};

/**
 * Runs the engine. After this is called, all Systems will have update called every frame.
 * @final
 * @this {CrunchJS.World}
 */
CrunchJS.World.prototype.run = function() {
	this._isRunning = true;
	this._clock.start();

	this.fireEvent(CrunchJS.Events.Started);
};

/**
 * Pauses the CrunchJS. All Systems will not have their update function called.
 * @final
 * @this {CrunchJS.World}
 */
CrunchJS.World.prototype.pause = function() {
	this._isRunning = false;
	this._clock.stop();

	this.fireEvent(CrunchJS.Events.Paused);
};

/**
 * Steps the engine forward by one frame. Useful for pausing, and then stepping through the simulationx.
 * @final
 */
CrunchJS.World.prototype.step = function() {
	var frame = this._frameManager.nextFrame();

	// Update the scene
	this._sceneManager.process(frame);

	this._frameManager.frameOver();
};


/**
 * Adds a channel to talk to the Main Window
 * @param {CrunchJS.IChannel} channel The Channel to add
 */
CrunchJS.World.prototype.setMainChannel = function(channel) {
	this.mainChannel = channel;
};

/**
 * Checks if the environment is a simulation
 * @return {Boolean} Returns true if it is a simulation
 */
CrunchJS.World.prototype.isSim = function() {
	return this._isSim;
};

/**
 * Checks if the engine is running
 * @return {Boolean} Returns true if the engine is running
 */
CrunchJS.World.prototype.isRunning = function() {
	return this._isRunning;
};

/**
 * Adds a Scene to the scene manager
 * @param {CrunchJS.Scene} scene The Scene to add
 */
CrunchJS.World.prototype.addScene = function(scene) {
	return this._sceneManager.addScene(scene);
};

/**
 * Removes the Scene from the world
 * @param  {CrunchJS.Scene|String} scene The Scene object or the name of the scene object
 * @return {boolean}       Whether the scene object was found and removed
 */
CrunchJS.World.prototype.removeScene = function(scene) {
	return this._sceneManager.removeScene(scene);
};

/**
 * Gets the Scene
 * @param  {String} sceneName The Scene Name
 * @return {CrunchJS.Scene}   The Scene
 */
CrunchJS.World.prototype.getScene = function(sceneName) {
	return this._sceneManager.getScene(sceneName);
};

/**
 * Transitions from the current scene to the scene corrisponding to the specified name
 * @param  {String} sceneName The Scene Name
 * @param  {?Object} data     Optional data that will be passed into the new scene's activate method
 * @return {Boolean}          Whether the new scene was found and the transition occured successfully.
 */
CrunchJS.World.prototype.transitionScene = function(sceneName, data) {
	return this._sceneManager.transitionScene(sceneName, data);
};

/**
 * Gets the current Scene 
 * @return {CrunchJS.Scene} The current scene
 */
CrunchJS.World.prototype.getCurrentScene = function() {
	return this._sceneManager.getCurrentScene();
};

/**
 * Posts an event to the currently active scene
 * @param  {String} eventName The Event Name
 * @param  {Object} data      The Event Data
 */
CrunchJS.World.prototype.fireEvent = function(eventName, data) {
	this._sceneManager.fireEvent(eventName, data);
};

