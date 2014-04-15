/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.Projectile');

goog.require('CrunchJS.Component');
goog.require('goog.object');


/**
 * Creates a projectile component
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.Projectile = function(params) {
	goog.base(this);

	var defaults = {
		speed : 50,
		dmg : 20
	};

	goog.object.forEach(defaults, function(val, key) {
		if(!params[key])
			params[key] = val;
	});

	this.id = params.id;

	this.speed = params.speed;

	this.dmg = params.dmg;

	this.updates = {};
};

goog.inherits(CloseContact.Components.Projectile, CrunchJS.Component);

CloseContact.Components.Projectile.prototype.name = 'Projectile';

CloseContact.Components.Projectile.prototype.getId = function() {
	return this.id;
};

CloseContact.Components.Projectile.prototype.getSpeed = function() {
	return this.speed;
};

CloseContact.Components.Projectile.prototype.getDmg = function() {
	return this.dmg;
};

CloseContact.Components.Projectile.prototype.setId = function(id) {
	if(this.id != id){
		this.id = id;
		this.updates.id = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Projectile.prototype.setSpeed = function(speed) {
	if(this.speed != speed){
		this.speed = speed;
		this.updates.speed = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Projectile.prototype.setDmg = function(dmg) {
	if(this.dmg != dmg){
		this.dmg = dmg;
		this.updates.dmg = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Projectile.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};

