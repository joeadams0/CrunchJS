/**
 * @author Joe Adams
 * @namespace CrunchJS
 * @description  This is the main namespace for CrunchJS. All of these classes are a part of the core engine functionality.
 */
// Load all of the vendor stuff if its not compiled

goog.provide('CrunchJS');
goog.provide('CrunchJS.World');
goog.provide('CrunchJS.Events');
goog.provide('CrunchJS.DEBUG');
goog.provide('CrunchJS.LogLevels');
goog.provide('CrunchJS.EngineCommands');
goog.provide('CrunchJS.DATA_SYNC_DEBUG');

goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.object');

goog.require('CrunchJS.Internal.SceneManager');
goog.require('CrunchJS.Internal.FrameManager');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');
goog.require('CrunchJS.Network.RemoteEngine.MainRemoteEngine');
goog.require('CrunchJS.Utils.vendor');

/**
 * Global debug flag
 * When compiled, this is set in the build settings 
 * @define {boolean} 
 */
CrunchJS.DEBUG = true;

// Exporting it so you can change it at runtime
goog.exportSymbol('CrunchJS.DATA_SYNC_DEBUG');

/**
 * Data sync debug flag
 * When compiled, this is set in the build settings 
 * @define {boolean} 
 */
CrunchJS.DATA_SYNC_DEBUG = false;

/**
 * The engine wide events
 * @enum
 */
CrunchJS.Events = {
	/**
	 * Fired when the engine is started
	 * @type {String}
	 */
	Started : 'engine_started',

	/**
	 * Fired when the engine is paused
	 * @type {String}
	 */
	Paused : 'engine_paused',

	/**
	 * Fired when the scene creates an entity
	 * @type {String}
	 */
	EntityCreated : 'entity_created',

	/**
	 * Fired when the scene destroys an entity
	 * @type {String}
	 */
	EntityDestroyed : 'entity_destroyed',

	/**
	 * Fired when an entity is enabled
	 * @type {String}
	 */
	EntityEnabled : 'entity_enabled',

	/**
	 * Fired when an entity is disabled
	 * @type {String}
	 */
	EntityDisabled : 'entity_disabled',

	/**
	 * Fired when an entity composition is changed
	 * @type {String}
	 */
	EntityChanged : 'entity_changed',

	/**
	 * Fired when a component is updated
	 * @type {String}
	 */
	ComponentUpdated: 'component_changed',

	/**
	 * Fired when a simulation is added to a scene
	 * @type {String}
	 */
	SimAdded : 'sim_added',

	/**
	 * Fired when a simualtion is removed from a scene
	 * @type {String}
	 */
	SimRemoved : 'sim_removed',

	/**
	 * Sends a command to a remote engine
	 * @type {String}
	 */
	SendCommand : 'send_command',
	
	/**
	 * Sends network commands to all peers
	 * @type {String}
	 */
	SendNetworkCommand : 'send_network_command',

	/**
	 * Fired when the data has been refreshed
	 * @type {String}
	 */
	RefreshData : 'refresh_data'

};

/**
 * These commands are used for syncing data and actions with the simulation
 * @enum {String}
 */
CrunchJS.EngineCommands = {

	/**
	 * Starts the simulation
	 * @type {String}
	 */
	Run : 'run',

	/**
	 * Pauses the simulation
	 * @type {String}
	 */
	Pause : 'pause',

	/**
	 * Write to the console
	 * @type {String}
	 */
	Write : 'write',

	/**
	 * Create an entity
	 * @type {String}
	 */
	CreateEntity : 'create_entity',

	/**
	 * Destroy an entity
	 * @type {String}
	 */
	DestroyEntity : 'destroy_entity',

	/**
	 * Update an entity
	 * @type {String}
	 */
	UpdateComponents : 'update_components',

	/**
	 * Enable an entity
	 * @type {String}
	 */
	EnableEntity : 'enable_entity',

	/**
	 * Disable an entity
	 * @type {String}
	 */
	DisableEntity : 'disable_entity',

	/**
	 * Requests the sync data
	 * @type {String}
	 */
	SyncRequest : 'sync_request',

	/**
	 * Provides the sync data
	 * @type {String}
	 */
	Sync : 'sync',

	SetEntityName : 'set_entity_name'

};




/**
 * The log levels
 * @enum {String}
 */
CrunchJS.LogLevels = {
	/**
	 * Logs with this level will only be shown in debug mode
	 * @type {String}
	 */
	DEBUG : 'DEBUG: ',

	/**
	 * Displays a warning. This will always be shown.
	 * @type {String}
	 */
	WARNING : 'WARNING: ',

	/**
	 * Displays an error. This will always be shown.
	 * @type {String}
	 */
	ERROR : 'ERROR: ',

	/**
	 * Displays a fatal error. This will always be shown.
	 * @type {String}
	 */
	FATAL : 'FATAL: '
};


/**
 * @description This is the main object for the CrunchJS Engine. It can be thought of as a collection of scenes, with each scene will have its 
 * own data and entities. Scenes can be added, removed, and transitioned between. This creates a new instance of the World CrunchJS
 * and should be a singleton. Global access at CrunchJS.world.
 * @param {(Object|string)=} config The configurations for the engine.
 * @param {Number=} config.fps The frames per second to run at. Usually leave this undefined so that the engine can pick the optimal rate.
 * @class 
 * @constructor
 *
 * @example
 * // Create a world that uses a webworker for the simulation
 * var world = new CrunchJS.World();
 *
 * // Then create scenes and add them to the world
 */
CrunchJS.World = function(config) {

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
	 * Is the script running in a webworker
	 * @type {Boolean}
	 * @private
	 */
	this._isWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;


	/**
	 * True if the engine is a simulation
	 * @type {Boolean}
	 * @private
	 */
	this._isSim = this._isWebWorker;


	/**
	 * Is the engine running
	 * @type {Boolean}
	 * @private
	 */
	this._isRunning = false;

	/**
	 * Manages the Scenes for the Game
	 * @type {CrunchJS.Internal.SceneManager}
	 * @private
	 */
	this._sceneManager = new CrunchJS.Internal.SceneManager();


	/**
	 * Manages the Frames for the game
	 * @type {CrunchJS.Internal.FrameManager}
	 * @private
	 */
	this._frameManager = new CrunchJS.Internal.FrameManager();


	// Public vars 
	
	/**
	 * The CrunchJS configs	
	 * @type {Object}
	 * @public
	 */
	this.config = null;


	/**
	 * The chanel to the main engine. Null if not in a simulation
	 * @type {CrunchJS.Network.RemoteSystem.MainRemoteSystem}
	 * @public
	 */
	this.mainEngine = null;

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
	if(this.isSim() && this._isWebWorker){
	    
		this.mainEngine = new CrunchJS.Network.RemoteEngine.MainRemoteEngine();
		
	}

	if(!COMPILED)
  		CrunchJS.Utils.vendor.go(CrunchJS.Utils.vendor.files);

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

	this.log('Engine Running');

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

	this.log('Engine Paused');
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
	
	//demonstrate SendNetworkCommand event
	if(frame.id % 5 == 0)
	{
		this.fireEvent(CrunchJS.Events.SendNetworkCommand, frame.id);
	}
};


/**
 * Gets the main engine
 * @return {CrunchJS.Network.RemoteEngine.MainRemoteEngine} The main channel
 */
CrunchJS.World.prototype.getMainEngine = function() {
	return this.mainEngine;
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
	var success = this._sceneManager.addScene(scene);

	return success;
};

/**
 * Removes the Scene from the world
 * @param  {CrunchJS.Scene|String} scene The Scene object or the name of the scene object
 * @return {boolean}       Whether the scene object was found and removed
 */
CrunchJS.World.prototype.removeScene = function(scene) {
	var resetListeners = this._sceneManager.isCurrentScene(scene);
	var success = this._sceneManager.removeScene(scene);

	return success;
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
	var success = this._sceneManager.transitionScene(sceneName, data);
	this.setListeners();
	return success;
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

/**
 * Logs a message
 * @param  {Object} message The object to log
 * @param  {CrunchJS.LogLevel} level   The log level
 */
CrunchJS.World.prototype.log = function(message, level) {
	if(!level)
		level = CrunchJS.LogLevels.DEBUG;

	if(CrunchJS.DEBUG && level == CrunchJS.LogLevels.DEBUG){
		this.write({
			prefix : level,
			message : message
		});
	}
	else
		this.write({
			prefix : level,
			message : message
		});		
};

/**
 * Writes a message. Use log method instead
 * @param {Object} prefix The prefix of the message
 * @param {Object} message The message
 */
CrunchJS.World.prototype.write = function(data) {
	if(this.isSim()){
		data['prefix'] = 'WW - ' + data.prefix;
		data['message'] = data.message;
		this.getMainEngine().write(data);
	}
	else{
		console.log(data.prefix, data.message);
	}
};

