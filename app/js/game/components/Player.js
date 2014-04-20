/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.Player');

goog.require('CrunchJS.Component');

/**
 * The player component
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.Player = function(params) {
	goog.base(this, params);

	var defaults = {
		pId : 1
	};

	if(!params)
		params = {};
	
	goog.object.forEach(defaults, function(el, key) {
		if(!params[key])
			params[key] = el;
	});

	this.pId = params.pId;

	this.updates = {};
};

goog.inherits(CloseContact.Components.Player, CrunchJS.Component);

CloseContact.Components.Player.prototype.name = 'Player';

CloseContact.Components.Player.prototype.getPId = function() {
	return this.pId;
};

CloseContact.Components.Player.prototype.setPId = function(pId) {
	if(this.pId != pId){
		this.pId = pId;
		this.updates.pId = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Actor.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};	
