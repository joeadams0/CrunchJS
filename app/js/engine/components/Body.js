/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Body');

goog.require('CrunchJS.Component');
goog.require('goog.math.Size');

/**
 * Contains data about the size of the object
 * @param {Number}  width  The width of the entity
 * @param {Number}  height The height of the entity
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Body = function(params) {
	var width = goog.isNumber(params.width) ? params.width : 10;
	var height = goog.isNumber(params.height) ? params.height : 10;

	/**
	 * The size of the entity
	 * @type {goog.math.Size}
	 */
	this.size = new goog.math.Size(width,height);

	this.updates = {};
};

goog.inherits(CrunchJS.Components.Body, CrunchJS.Component);

CrunchJS.Components.Body.prototype.name = 'Body';

/**
 * Gets the size
 * @return {goog.math.Size} The size
 */
CrunchJS.Components.Body.prototype.getSize = function() {
	return this.size;
};

/**
 * Sets the size of the body
 * @param {Number} width  The width of the body
 * @param {Number} height The height of the body
 */
CrunchJS.Components.Body.prototype.setSize = function(width, height) {
	if(this.size.width != width){
		this.size.width = width;
		this.hasBeenUpdated();
		this.updates.width = true;
	}
	if(this.size.height != height){
		this.size.height = height;
		this.hasBeenUpdated();
		this.updates.height = true;
	}
};

CrunchJS.Components.Body.prototype.getUpdates = function() {
	var obj = {};

	if(this.updates.width)
		obj.width = this.getSize().width;
	if(this.updates.height)
		obj.height = this.getSize().height;

	return obj;
};

CrunchJS.Components.Body.prototype.update = function(obj) {
	if(obj.width)
		this.getSize().width = obj.width;
	if(obj.height)
		this.getSize().height = obj.height;
};

CrunchJS.Components.Body.prototype.toObj = function() {
	var obj = {};

	obj.width = this.getSize().width;
	obj.height = this.getSize().height

	return obj;
};

