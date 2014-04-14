/**
 * @author  Joe Adams
 */

goog.provide('CloseContact.Components.Actor');

goog.require('CrunchJS.Component');

goog.require('goog.object');
/**
 * The Actor Component has the basic data about the state of the actor, ie health armor ect.
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.Actor = function(params) {
	goog.base(this, params);

	// The default actor
	var defaultConfigs = {
		maxHealth : 100,
		attackDmg : 10,
		armor : 0,
		movementSpeed : 1,
		attackSpeed : 1,
		attackRange : 50,
		team : 0
	};

	if(!params)
		params = {};

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
	this.health = params.health ? params.health : params.maxHealth;

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

	/**
	 * The attack range of the actor
	 * @type {Number}
	 */
	this.attackRange = params.attackRange;

	/**
	 * The Team this actor is on
	 * @type {Number}
	 */
	this.team = params.team;

	/**
	 * The last time this actor attacked
	 * @type {Number}
	 */
	this.lastAttackTime = 0;

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
 * Gets the attack range for the Actor
 * @return {Number} The attack range
 */
CloseContact.Components.Actor.prototype.getAttackRange = function() {
	return this.attackRange;
};

/**
 * Gets the team this actor is on
 * @return {Number} The team
 */
CloseContact.Components.Actor.prototype.getTeam = function() {
	return this.team;
};

CloseContact.Components.Actor.prototype.getLastAttackTime = function() {
	return this.lastAttackTime;
};

CloseContact.Components.Actor.prototype.getNextAttackTime = function() {
	var t = this.getLastAttackTime(),
		attackDelta = 1000/this.getAttackSpeed();

	t = t + attackDelta;

	return t;
};

CloseContact.Components.Actor.prototype.getAction = function() {
	return this.action;
};

/**
 * Sets the health for the actor
 * @param {Number} health 
 */
CloseContact.Components.Actor.prototype.setHealth = function(health) {
	if(this.health != health){
		this.health = health;
		this.updates.health = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the full health for the actor
 * @param {Number} full health 
 */
CloseContact.Components.Actor.prototype.setFullHealth = function(fullHealth) {
	if(this.fullHealth != fullHealth){
		this.fullHealth = fullHealth;
		this.updates.fullHealth = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the attack damage for the actor
 * @param {Number} attack damage 
 */
CloseContact.Components.Actor.prototype.setAttackDmg = function(attackDmg) {
	if(this.attackDmg != attackDmg){
		this.attackDmg = attackDmg;
		this.updates.attackDmg = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the armor for the actor
 * @param {Number} armor 
 */
CloseContact.Components.Actor.prototype.setArmor = function(armor) {
	if(this.armor != armor){
		this.armor = armor;
		this.updates.armor = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the movement speed for the actor
 * @param {Number} movement speed 
 */
CloseContact.Components.Actor.prototype.setMovementSpeed = function(movementSpeed) {
	if(this.movementSpeed != movementSpeed){
		this.movementSpeed = movementSpeed;
		this.updates.movementSpeed = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the attack speed for the actor
 * @param {Number} attack speed 
 */
CloseContact.Components.Actor.prototype.setAttackSpeed = function(attackSpeed) {
	if(this.attackSpeed != attackSpeed){
		this.attackSpeed = attackSpeed;
		this.updates.attackSpeed = true;
		this.hasBeenUpdated();
	}
};

/**
 * Sets the attack range for the actor
 * @param {Number} attack range 
 */
CloseContact.Components.Actor.prototype.setAttackRange = function(attackRange) {
	if(this.attackRange != attackRange){
		this.attackRange = attackRange;
		this.updates.attackRange = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Actor.prototype.setTeam = function(team) {
	if(this.team != team){
		this.team = team;
		this.updates.team = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Actor.prototype.setLastAttackTime = function(lastAttackTime) {
	if(this.lastAttackTime != lastAttackTime){
		this.lastAttackTime = lastAttackTime;
		this.updates.lastAttackTime = true;
		this.hasBeenUpdated();
	}
};

CloseContact.Components.Actor.prototype.setAction = function(action) {
	if(this.action != action){
		this.action = action;
		this.updates.action = true;
		this.hasBeenUpdated();
	}
};


CloseContact.Components.Actor.prototype.takeAttackDmg = function(dmg) {
	dmg = dmg - this.getArmor();
	this.takeTrueDmg(dmg);
};

CloseContact.Components.Actor.prototype.takeTrueDmg = function(dmg) {
	CrunchJS.world.log(this.getHealth());
	this.setHealth(Math.max(this.getHealth()-dmg, 0));
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


