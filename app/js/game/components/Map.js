/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.Map');

goog.require('CrunchJS.Component');

/**
 * The map component
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.Map = function(params) {
	goog.base(this, params);

	this.updates = {};
};

goog.inherits(CloseContact.Components.Map, CrunchJS.Component);

CloseContact.Components.Map.prototype.name = 'Map';


CloseContact.Components.Actor.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};	
