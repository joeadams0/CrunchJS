/**
 * @author  Joe Adams
 */

goog.provide('CrunchJS.EntityComposition');

goog.require('CrunchJS.Utils.BitSetOperator');
goog.require('goog.array');

/**
 * Creates an instance. Do not use, rather use component manager to instantiate
 * @param {CrunchJS.ComponentManager} componentManager The component manager
 * @constructor
 * @class Operates on entity Compostions
 * @private
 */
CrunchJS.EntityComposition = function(componentManager) {
	this.bsOp = CrunchJS.Utils.BitSetOperator.getInstance();

	/**
	 * The bitset describing a group of components where all of them need to be present for the compostiton to work
	 * @type {Array}
	 */
	this._allSet = this.bsOp.createBitSet();

	/**
	 * The bitset describing a group of components where only one of them has to be present
	 * @type {Array}
	 */
	this._oneSet = this.bsOp.createBitSet();

	/**
	 * The bitset describing a group of components where none of them can be present
	 * @type {Array}
	 */
	this._exclusionSet = this.bsOp.createBitSet();

	/**
	 * The component Manager
	 * @type {CrunchJS.ComponentManager}
	 */
	this._componentManager = componentManager;
};	

/**
 * Gets the allSet
 * @return {Array} The bitset describing the allSet
 */
CrunchJS.EntityComposition.prototype.getAllSet = function() {
	return this._allSet;
};

/**
 * Gets the one set
 * @return {Array} The bitset describing the one set
 */
CrunchJS.EntityComposition.prototype.getOneSet = function() {
	return this._oneSet;
};

/**
 * Gets the exclusion set
 * @return {Array} The bitset describing the exclusion set
 */
CrunchJS.EntityComposition.prototype.getExclusionSet = function() {
	return this._exclusionSet;
};

/**
 * Creates a bitset for the following components
 * @param  {Array} comps An array of component names
 * @return {Array}       The bitset
 */
CrunchJS.EntityComposition.prototype.createBitSet = function(comps) {
	var bitset = this.bsOp.createBitSet(),
		iter = function(compName) {
			// If it doesnt have the comp type, make it bc it will prob be coming soon
			if(!this._componentManager.hasComponentType(compName))
				this._componentManager.createComponentType(compName);

			this.bsOp.set(bitset, this._componentManager.getComponentIndex(compName));
		};

	goog.array.forEach(comps, goog.bind(iter, this));

	return bitset;
};

/**
 * Set the all set
 * @param {...string} compNames The names of the components
 * @example
 * 
 * // A match will have all of these components
 * entComp.all('Physics', 'Rendering', 'Position');
 */
CrunchJS.EntityComposition.prototype.all = function() {
	this._allSet = this.createBitSet(arguments);
	return this;
};

/**
 * Set the one set
 * @param {...string} compNames The names of the components
 *
 * @example
 * 
 * // A match will have one of these components
 * entComp.one('Physics', 'Rendering', 'Position');
 */
CrunchJS.EntityComposition.prototype.one = function() {
	this._oneSet = this.createBitSet(arguments);
	return this;
};

/**
 * Set the exclusion set
 * @param {...string} compNames The names of the components
 *
 * @example
 * // A match will have none of these components
 * entComp.exclude('Physics', 'Rendering', 'Position');
 */
CrunchJS.EntityComposition.prototype.exclude = function() {
	this._exclusionSet = this.createBitSet(arguments);
	return this;
};

/**
 * Checks if this compostition matches the bitset
 * @param  {Array} bitset The bitset
 * @return {Boolean}        True if it matches
 */
CrunchJS.EntityComposition.prototype.matches = function(bitset) {
	var interested = true;

	interested = this.matchesAllSet(bitset);

	if(interested)
		interested = this.matchesOneSet(bitset);

	if(interested)
		interested = this.matchesExclusionSet(bitset);

	return interested;
};

/**
 * Returns True if the bitset matches the all set
 * @param  {Array} bitset The bitset
 * @return {Boolean}        True if it finds all of the bits in the bitset
 */
CrunchJS.EntityComposition.prototype.matchesAllSet = function(bitset) {
	var	set = this.getAllSet();

	for(var i = 1; i<=this.bsOp.length(set); i++){
		if(this.bsOp.get(set, i))
			if(!(this.bsOp.get(bitset, i)))
				return false;
	}

	return true;
};

/**
 * Returns True if the bitset matches the one set
 * @param  {Array} bitset The bitset
 * @return {Boolean}        True if it finds just one of the oneSet in the bitset
 */
CrunchJS.EntityComposition.prototype.matchesOneSet = function(bitset) {
	var	set = this.getOneSet();

	if(this.bsOp.length(set)== 0)
		return true;
	
	for(var i = 1; i<=this.bsOp.length(set); i++){
		if(this.bsOp.get(set, i))
			if(this.bsOp.get(bitset, i))
				return true;
	}

	return false;
};

/**
 * Returns True if the bitset matches the exclusion set
 * @param  {Array} bitset The bitset
 * @return {Boolean}        True if it finds that none of the exclusionSet is in the bitset
 */
CrunchJS.EntityComposition.prototype.matchesExclusionSet = function(bitset) {
	var	set = this.getExclusionSet();

	for(var i = 1; i<=this.bsOp.length(set); i++){
		if(this.bsOp.get(set, i) && this.bsOp.get(bitset, i))
				return false;
	}

	return true;
};









