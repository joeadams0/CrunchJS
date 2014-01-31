/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Internal.Manager');

/**
 * Creates a manager Object
 * @param {CrunchJS.Scene} scene The scene this manager is assigned to
 * @constructor
 * @class The basic manager class
 */
CrunchJS.Internal.Manager = function(scene) {
	/**
	 * Set the scene that this manager is a part of
	 * @type {CrunchJS.Scene}
	 * @protected
	 */
	this._scene = scene;

	/**
	 * Is the manager active
	 * @type {Boolean}
	 */
	this._active = false;
};

/**
 * Sets the scene that this manager is a part of
 * @param {CrunchJS.Scene} scene The scene
 */
CrunchJS.Internal.Manager.prototype.setScene = function(scene) {
	this._scene = scene;
};

/**
 * Gets the scene that this manager is a part of
 * @return {CrunchJS.Scene} The current scene
 */
CrunchJS.Internal.Manager.prototype.getScene = function() {
	return this._scene;
};

/**
 * Called when the scene this manager is a part of is activated
 */
CrunchJS.Internal.Manager.prototype.activate = function() {
	this._active = true;
};

/**
 * Called when the manager is deactivated
 */
CrunchJS.Internal.Manager.prototype.deactivate = function() {
	this._active = false;
};

/**
 * Is the manager active
 * @return {Boolean} True if it is active
 */
CrunchJS.Internal.Manager.prototype.isActive = function() {
	return this._active;
};
