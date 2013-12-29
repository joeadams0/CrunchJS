/**
 * @author  Joe Adams
 */

goog.provide("Engine.SystemManager");

goog.require('goog.array');


/**
 * Creates a new System Manager
 * @constructor
 * @class  Manages all of the Systems for the game (for internal use)
 * @this {Engine.SystemManager}
 */
Engine.SystemManager = function() {

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

/**
 * Updates all of the systems
 * @param  {Engine.Frame} frame The current frame
 */
Engine.SystemManager.prototype.update = function(frame) {
	goog.array.forEach(this.systems, 
		/**
		 * Updates each System
		 * @param  {Engine.System} system The System to update
		 */
		function(system) {
			if(goog.object.containsKey(system, "update"))
				system.update(frame);
	});
};

/** 
 * Adds a System to the Engine
 * @param {Engine.System} system [description]
 */
Engine.SystemManager.prototype.addSystem = function(system) {
	if(this.systemsPool.length > 0){
		var key = this.systemsPool.length;
		this.systems[key] = system;
	}
	else
		this.systems.push(system);
};

/**
 * Removes a System from the world
 * @param  {String} systemName The identifer of the System
 */
Engine.SystemManager.prototype.removeSystem = function(systemName) {
	goog.array.removeIf(this.systems, function(system) {
		return system.__identifier == systemName;
	});
};

