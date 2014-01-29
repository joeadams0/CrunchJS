/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleScene');

goog.require('CrunchJS.Scene');

/**
 * Creates an example scene
 * @constructor
 * @class An Example Scene
 * @extends {CrunchJS.Scene}
 */
Moba.ExampleScene = function() {
	goog.base(this);
};

goog.inherits(Moba.ExampleScene, CrunchJS.Scene);

/**
 * Set the name of the Scene
 * @type {String}
 */
Moba.ExampleScene.prototype.name = 'ExampleScene';

/**
 * Print a message when you activate
 * @param  {?Object} data The data if any
 */
Moba.ExampleScene.prototype.activate = function(data) {
	goog.base(this, "activate", data);
};

/**
 * Print a message when deactivating
 */
Moba.ExampleScene.prototype.deactivate = function() {
	goog.base(this, "deactivate");
};