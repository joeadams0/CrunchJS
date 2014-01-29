/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleSystem1');

goog.require('CrunchJS.System');

/**
 * A basic system constructor
 * @constructor
 * @class Example System 1
 */
Moba.ExampleSystem1 = function() {
	goog.base(this);
};

goog.inherits(Moba.ExampleSystem1, CrunchJS.System);

Moba.ExampleSystem1.prototype.name = "ExampleSystem1";

Moba.ExampleSystem1.prototype.activate = function() {
	goog.base(this, 'activate');
	this.setEntityComposition(this.getScene().createEntityComposition().all('ExampleComp', 'ExampleComp1'));
};

