/**
 * @author  Joe Adams
 */

goog.provide('CloseContact.Components.Actor');

goog.require('CrunchJS.Component');

goog.require('goog.object');
/**
 * The Actor Component has the basic data about the state of the actor, ie health armor ect.
 * @param {[type]} params [description]
 */
CloseContact.Components.Actor = function(params) {
	goog.base(this);

	// The default actor
	var defaultConfigs = {
		fullHealth : 100,
		attackDmg : 10,
		armor : 0
	};

	// Write configs if they havent specifed them
	goog.object.forEach(defaultConfigs, function(prop, key) {
		if(!params[key])
			params[key] = prop;
	}, this);


	/**
	 * The Health of the actor
	 * @type {Number}
	 */
	this.fullHealth = params.fullHealth;

	/**
	 * The health of the actor
	 * @type {Number}
	 */
	this.health = params.health;

	/**
	 * The attack damage of the actor
	 * @type {Number}
	 */
	this.attackDmg = params.attackDmg;

	/**
	 * The Armor of the actor
	 * @type {Number}
	 */
	this.armor = params.armor;


	this.updates = {};

};