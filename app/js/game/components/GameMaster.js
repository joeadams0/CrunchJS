/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.GameMaster');

goog.require('CrunchJS.Component');

/**
 * The game master component
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.GameMaster = function(params) {
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

goog.inherits(CloseContact.Components.GameMaster, CrunchJS.Component);

CloseContact.Components.GameMaster.prototype.name = 'GameMaster';

CloseContact.Components.GameMaster.prototype.getPId = function() {
	return this.pId;
};

CloseContact.Components.GameMaster.prototype.setPId = function(pId) {
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
