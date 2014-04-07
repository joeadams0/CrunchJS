/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.Attack');

goog.require('CrunchJS.Component');

/** 
 * Creates a component to attack another entity	
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.Attack = function(params) {
	goog.base(this, params);
	this.entity = params.entity;
};

goog.inherits(CloseContact.Components.Attack, CrunchJS.Component);

CloseContact.Components.Attack.prototype.name = 'Attack';


CloseContact.Components.Attack.prototype.getEntity = function() {
	return this.entity;
};

CloseContact.Components.Attack.prototype.setEntity = function(entity) {
	if(this.entity != entity){
		this.entity = entity;
		this.updates.entity = true;
		this.hasBeenUpdated();
	}
};