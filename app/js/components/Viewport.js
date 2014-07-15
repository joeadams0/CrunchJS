/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Viewport');

goog.require('CrunchJS.Component');

/**
 * Creates an Viewport Component. This component is used to define the characteristics of the viewport for rendering the game.
 * @constructor
 * @class 
 */
CrunchJS.Components.Viewport = function(params) {
	goog.base(this, params);

	this.width = params.width;
	this.height = params.height;

	this.aspectRatio = params.aspectRatio;

	this.mousePosition = params.mousePosition ? params.mousePosition : {};

	this.updates = {};
};

goog.inherits(CrunchJS.Components.Viewport, CrunchJS.Component);

CrunchJS.Components.Viewport.prototype.name = "Viewport";

/**
 * Gets the width for the Viewport
 * @return {Number} The width
 */
CrunchJS.Components.Viewport.prototype.getWidth = function() {
	return this.width;
};

/**
 * Sets the width for the Viewport
 * @param {Number} width The width
 */
CrunchJS.Components.Viewport.prototype.setWidth = function(width) {
	if(this.width != width){
		this.width = width;
		this.updates.width = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the height for the Viewport
 * @return {Number} The height
 */
CrunchJS.Components.Viewport.prototype.getHeight = function() {
	return this.height;
};

/**
 * Sets the width for the Viewport
 * @param {Number} width The width
 */
CrunchJS.Components.Viewport.prototype.setHeight = function(height) {
	if(this.height != height){
		this.height = height;
		this.updates.height = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the mouse position for the Viewport
 * @return {Object} The mouse position
 */
CrunchJS.Components.Viewport.prototype.getMousePosition = function() {
	return this.mousePosition;
};

/**
 * Sets the mouse position for the Viewport
 * @param {Object} width The mouse position
 */
CrunchJS.Components.Viewport.prototype.setMousePosition = function(mousePosition) {
	this.mousePosition = mousePosition;
	this.updates.mousePosition = true;
	this.hasBeenUpdated();
};

/**
 * Gets the aspectRatio for the Viewport
 * @return {Object} The aspect ratio
 */
CrunchJS.Components.Viewport.prototype.getAspectRatio = function() {
	return this.aspectRatio;
};

/**
 * Sets the aspect ratio for the Viewport
 * @param {Number} aspectRatio The aspect ratio
 */
CrunchJS.Components.Viewport.prototype.setAspectRatio = function(aspectRatio) {
	this.aspectRatio = aspectRatio;
	this.updates.aspectRatio = true;
	this.hasBeenUpdated();
};

CrunchJS.Components.Viewport.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};

CrunchJS.Components.Viewport.prototype.toObj = function() {
	var obj = goog.base(this, 'toObj', {});

	obj.width = this.width;
	obj.height = this.height;
	obj.mousePosition = this.mousePosition;
	obj.aspectRatio = this.aspectRatio;

	return obj;
};