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
CrunchJS.Components.Body = function(x,y) {
	x = x ? x : 10;
	y = y ? y : 10;

	/**
	 * The size of the entity
	 * @type {goog.math.Size}
	 */
	this.size = new goog.math.Size(x,y);
};

goog.inherits(CrunchJS.Components.Body, CrunchJS.Component);

CrunchJS.Components.Body.prototype.name = 'Body';