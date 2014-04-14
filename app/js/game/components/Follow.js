/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.Follow');

goog.requier('CrunchJS.Component');

/**
 * Creates a component to make an entity follow another entity
 * @constructor
 * @class 
 */
CloseContact.Components.Follow = function(params) {
	this.entityToFollow = params.entityToFollow;
	this.updates = {};
};

goog.inherits(CloseContact.Components.Follow, CrunchJS.Component);

CloseContact.Components.Follow.prototype.name = 'Follow';

CloseContact.Components.Follow.prototype.getEntityToFollow = function() {
	return this.entityToFollow;
};

CloseContact.Components.Follow.prototype.setEntityToFollow	= function(id) {
	if(this.entityToFollow != id){
		this.entityToFollow = id;
		this.updates.entityToFollow = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the updates for the component
 * @return {Object} The updates
 */
CloseContact.Components.Actor.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};	



CloseContact.Components.Follow.prototype.resetUpdates = function() {
	this.updates = {};
};