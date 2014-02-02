/**
 * @author Joe Adams
 */

goog.provide('Moba.ExampleComp');

goog.require('CrunchJS.Component');

/**
 * An example component
 * @constructor
 * @class Example Component
 * @extends {CrunchJS.Component}
 */
Moba.ExampleComp = function() {

	this['count'] = 0;
};

goog.inherits(Moba.ExampleComp, CrunchJS.Component);


Moba.ExampleComp.prototype.name = "ExampleComp";
