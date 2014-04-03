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
		armor : 0,
		movementSpeed : 1,
		attackSpeed : 1
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
	this.maxHealth = params.maxHealth;

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

	/**
	 * The movement speed of the actor
	 * @type {Number}
	 */
	this.movementSpeed = params.movementSpeed;

	/**
	 * The Attack speed for the actor
	 * @type {Number}
	 */
	this.attackSpeed = params.attackSpeed;


	this.updates = {};

};

goog.inherits(CloseContact.Components.Actor, CrunchJS.Component);

CloseContact.Components.Actor.prototype.name = "Actor";

/**
 * Gets the health for the actor
 * @return {Number} The health
 */
CloseContact.Components.Actor.prototype.getHealth = function() {
	return this.health;
};

/**
 * Gets the maximum health for the actor
 * @return {Number} Maximum health
 */
CloseContact.Components.Actor.prototype.getMaxHealth = function() {
	return this.maxHealth;
};

/**
 * Gets the Attack Damage for the Actor
 * @return {Number} The Actor
 */
CloseContact.Components.Actor.prototype.getAttackDmg = function() {
	return this.attackDmg;
};

/** 
 * Gets the Armor for the Actor
 * @return {Number} The Armor
 */
CloseContact.Components.Actor.prototype.getArmor = function() {
	return this.armor;
};

/**
 * Gets the movement speed for the Actor
 * @return {Number} The movement speed
 */
CloseContact.Components.Actor.prototype.getMovementSpeed = function() {
	return this.movementSpeed;
};

/**
 * Gets the attack speed for the Actor
 * @return {Number} The attack speed
 */
CloseContact.Components.Actor.prototype.getAttackSpeed = function() {
	return this.attackSpeed;
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Component.Actor.prototype.setHealth = function(health) {
	if(this.health != health){
		this.health = health;
		this.updates.health = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Component.Actor.prototype.setFullHealth = function(fullHealth) {
	if(this.fullHealth != fullHealth){
		this.fullHealth = fullHealth;
		this.updates.fullHealth = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Component.Actor.prototype.setAttackDmg = function(attackDmg) {
	if(this.attackDmg != attackDmg){
		this.attackDmg = attackDmg;
		this.updates.attackDmg = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Component.Actor.prototype.setArmor = function(armor) {
	if(this.armor != armor){
		this.armor = armor;
		this.updates.armor = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Component.Actor.prototype.setMovementSpeed = function(movementSpeed) {
	if(this.movementSpeed != movementSpeed){
		this.movementSpeed = movementSpeed;
		this.updates.movementSpeed = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Component.Actor.prototype.setAttackSpeed = function(attackSpeed) {
	if(this.attackSpeed != attackSpeed){
		this.attackSpeed = attackSpeed;
		this.updates.attackSpeed = true;
		this.hasBeenUpdated();
	}
};

/**
 * Gets the updates for the component
 * @return {Object} The updates
 */
CrunchJS.Components.Viewport.prototype.getUpdates = function() {
	var obj = {};

	goog.object.forEach(this.updates, function(updated, key) {
		if(updated)
			obj[key] = this[key];
	}, this);

	return obj;
};	


