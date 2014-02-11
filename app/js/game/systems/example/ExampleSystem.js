/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleSystem');
goog.provide('CrunchJS.Systems.PhysicsSystem');
goog.require('CrunchJS.System');

/**
 * Creates an example system
 * @extends {CrunchJS.System}
 * @constructor
 * @class An Example System
 */
Moba.ExampleSystem = function() {
	goog.base(this);
};

goog.inherits(Moba.ExampleSystem, CrunchJS.System);

Moba.ExampleSystem.prototype.name = 'ExampleSystem';

Moba.ExampleSystem.prototype.activate = function() {
	goog.base(this, 'activate');
	this.setEntityComposition(this.getScene().createEntityComposition().one('Body'));
};


Moba.ExampleSystem.prototype.processEntity = function(frame, entityId) {
	//CrunchJS.world.log(this.getScene().getComponent(entityId,"Body").size.area());
};