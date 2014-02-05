/**
 * @author  Joe Adams
 */

goog.provide('CrunchJS.Internal.SystemManager');

goog.require('goog.array');
goog.require('CrunchJS.Internal.Manager');

/**
 * Creates a new System Manager
 * @constructor
 * @class  Manages all of the Systems for the game (for internal use)
 * @this {CrunchJS.Internal.SystemManager}
 * @extends {CrunchJS.Internal.Manager}
 */
CrunchJS.Internal.SystemManager = function(scene) {
	goog.base(this, scene);

	/**
	 * The current systems
	 * @type {Array}
	 * @protected
	 */
	this.systems = [];

	/**
	 * The pool of unused spots in the systems array
	 * @type {Array}
	 * @protected
	 */
	this.systemsPool = [];
};

goog.inherits(CrunchJS.Internal.SystemManager, CrunchJS.Internal.Manager);

/**
 * Called when the scene is activated
 */
CrunchJS.Internal.SystemManager.prototype.activate = function() {
	goog.base(this, 'activate');
	
	goog.array.forEach(this.systems, 
		
		function(system) {
			this.activateSystem(system);
	}, this);	
};

/**
 * Deactivates the system
 */
CrunchJS.Internal.SystemManager.prototype.deactivate = function() {
		goog.array.forEach(this.systems, 
		
		function(system) {
			system.deactivate();
	});	
};

/**
 * Activates the system for this scene
 * @param  {CrunchJS.Internal.System} system The System to activate
 */
CrunchJS.Internal.SystemManager.prototype.activateSystem = function(system) {
	system.setScene(this.getScene());
	system.activate();
};

/**
 * Updates all of the systems
 * @param  {CrunchJS.Frame} frame The current frame
 */
CrunchJS.Internal.SystemManager.prototype.process = function(frame) {
	goog.array.forEach(this.systems, 
		/**
		 * Updates each System
		 * @param  {CrunchJS.Internal.System} system The System to update
		 */
		function(system) {
			system.process(frame);
	});
};

/** 
 * Adds a System to the CrunchJS
 * @param {CrunchJS.Internal.System} system [description]
 */
CrunchJS.Internal.SystemManager.prototype.addSystem = function(system) {
	if(this.systemsPool.length > 0){
		var key = this.systemsPool.length;
		this.systems[key] = system;
	}
	else
		this.systems.push(system);

	if(this.getScene() != null && this.getScene().isActive()){
		this.activateSystem(system);
	}
	
	if(!goog.isDefAndNotNull(system.getScene())){
		system.setScene(this.getScene());
	}
};

/**
 * Removes a System from the world
 * @param  {String} systemName The identifer of the System
 */
CrunchJS.Internal.SystemManager.prototype.removeSystem = function(systemName) {
	goog.array.removeIf(this.systems, function(system) {
		return system.__identifier == systemName;
	});
};


