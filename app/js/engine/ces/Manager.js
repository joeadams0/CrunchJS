/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Manager');

/**
 * Creates a manager Object
 * @param {CrunchJS.Scene} scene The scene this manager is assigned to
 * @constructor
 * @class The basic manager class
 */
CrunchJS.Manager = function(scene) {
	/**
	 * Set the scene that this manager is a part of
	 * @type {CrunchJS.Scene}
	 * @protected
	 */
	this._scene = scene;
};

/**
 * Sets the scene that this manager is a part of
 * @param {CrunchJS.Scene} scene The scene
 */
CrunchJS.Manager.prototype.setScene = function(scene) {
	this._scene = scene;
};

/**
 * Gets the scene that this manager is a part of
 * @return {CrunchJS.Scene} The current scene
 */
CrunchJS.Manager.prototype.getScene = function() {
	return this._scene;
};