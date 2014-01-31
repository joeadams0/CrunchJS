/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleComp1');

goog.require('CrunchJS.Component');

/**
 * An example component
 * @constructor
 * @class Example Component
 * @extends {CrunchJS.Component}
 */
Moba.ExampleComp1 = function() {

	this['ahahah'] = 0;
};

goog.inherits(Moba.ExampleComp1, CrunchJS.Component);


Moba.ExampleComp1.prototype.name = "ExampleComp1";

Moba.ExampleComp1.prototype.getNum = function() {
	return this['ahahah'];
};