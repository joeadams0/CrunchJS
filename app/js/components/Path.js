/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Path');

goog.require('CrunchJS.Component');

/**
 * Creates a Path Component. Path Components are used to execute movement of an entity along a predefined path. 
 * @param {Array} params.steps The array of steps in the path to follow
 * @param {Number} params.step The step to start at.
 * @constructor
 * @class 
 */
CrunchJS.Components.Path = function(params) {
	goog.base(this, params);

	this.steps = params.steps;

	this.step = params.steps ? params.step : 0;

	this.updates = {};
};

goog.inherits(CrunchJS.Components.Path, CrunchJS.Component);

CrunchJS.Components.Path.prototype.name = "Path";

/**
 * Get the steps for the path
 * @return {Array} The steps
 */
CrunchJS.Components.Path.prototype.getSteps = function() {
	return this.steps;
};

/**
 * Get the current step of the path
 * @return {Number} The current step
 */
CrunchJS.Components.Path.prototype.getStep = function() {
	return this.step;
};

/**
 * Sets the step of the path
 * @param {Number} step The step
 */
CrunchJS.Components.Path.prototype.setStep = function(step) {
	this.step = step;

	this.updates.step = true;

	this.hasBeenUpdated();
};

/**
 * Sets the steps for the path
 * @param {Array} steps The steps
 */
CrunchJS.Components.Path.prototype.setSteps = function(steps) {
	this.steps = steps;

	this.updates.steps = true;

	this.hasBeenUpdated();
};

CrunchJS.Components.Path.prototype.getUpdates = function() {
	var obj = {};

	if(this.updates.step)
		obj.step = this.step;
	if(this.updates.steps)
		obj.steps = this.steps;

	return obj;
};

CrunchJS.Components.Path.prototype.update = function(obj) {
	if(obj.step)
		this.step = obj.step;
	if(obj.step)
		this.step = obj.step;
};



