/**
 * @author  Joe Adams
 */

goog.provide('CrunchJS.SystemManager');

goog.require('goog.array');
goog.require('CrunchJS.Manager');

/**
 * Creates a new System Manager
 * @constructor
 * @class  Manages all of the Systems for the game (for internal use)
 * @this {CrunchJS.SystemManager}
 * @extends {CrunchJS.Manager}
 */
CrunchJS.SystemManager = function(scene) {
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

goog.inherits(CrunchJS.SystemManager, CrunchJS.Manager);

/**
 * Called when the scene is activated
 */
CrunchJS.SystemManager.prototype.activate = function() {

	goog.array.forEach(this.systems, 
		
		function(system) {
			this.activateSystem(system);
	});	
};

/**
 * Activates the system for this scene
 * @param  {CrunchJS.System} system The System to activate
 */
CrunchJS.SystemManager.prototype.activateSystem = function(system) {
	system.setScene(this.getScene());
	system.activate();
};

/**
 * Updates all of the systems
 * @param  {CrunchJS.Frame} frame The current frame
 */
CrunchJS.SystemManager.prototype.process = function(frame) {
	goog.array.forEach(this.systems, 
		/**
		 * Updates each System
		 * @param  {CrunchJS.System} system The System to update
		 */
		function(system) {
			system.process(frame);
	});
};

/** 
 * Adds a System to the CrunchJS
 * @param {CrunchJS.System} system [description]
 */
CrunchJS.SystemManager.prototype.addSystem = function(system) {
	if(this.systemsPool.length > 0){
		var key = this.systemsPool.length;
		this.systems[key] = system;
	}
	else
		this.systems.push(system);

	if(this.getScene() != null && this.getScene().isActive()){
		this.activateSystem(system);
	}
};

/**
 * Removes a System from the world
 * @param  {String} systemName The identifer of the System
 */
CrunchJS.SystemManager.prototype.removeSystem = function(systemName) {
	goog.array.removeIf(this.systems, function(system) {
		return system.__identifier == systemName;
	});
};


