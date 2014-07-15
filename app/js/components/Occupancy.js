	/**
	 * @author Joe Adams
	 */

	goog.provide('CrunchJS.Components.Occupancy');

	goog.require('CrunchJS.Component');
	goog.require('goog.math.Size');
	goog.require('goog.object');

	/**
	 * Creates an Occupancy Component. This component is used to define the characteristics of an entity being placed on an occupancy map.
	 * @param {Object} size     If this is set, it will be the size that the entity will occupy on the map, instead of the Body Components size. This should have size.width and size.height defined
	 * @constructor
	 * @class 
	 */
	CrunchJS.Components.Occupancy = function(params) {
		goog.base(this, params);

		var defaults = {
			canSeeThrough : false
		}

		if(!params)
			params = {};


		goog.object.forEach(defaults, function(val, key) {
			if(!params[key])
				params[key] = val;
		});

		if(params.size)
			this.size = params.size;

		this.canSeeThrough = params.canSeeThrough;

		this.updates = {};
	};

	goog.inherits(CrunchJS.Components.Occupancy, CrunchJS.Component);

	CrunchJS.Components.Occupancy.prototype.name = "Occupancy";

	/**
	 * Gets the size for the Occupancy, if there is one
	 * @return {goog.math.Size} The size
	 */
	CrunchJS.Components.Occupancy.prototype.getSize = function() {
		return this.size;
	};

	/**
	 * Sets the size for the Occupancy
	 * @param {goog.math.Size} size The size
	 */
	CrunchJS.Components.Occupancy.prototype.setSize = function(size) {
		if(!goog.math.Size.equals(this.getSize(), size)){
			this.size = size;
			this.updates.size = true;
			this.hasBeenUpdated();
		}
	};

	CrunchJS.Components.Occupancy.prototype.getCanSeeThrough = function() {
		return this.canSeeThrough;
	};

	CrunchJS.Components.Occupancy.prototype.setCanSeeThrough = function(canSeeThrough) {
		if(this.canSeeThrough != canSeeThrough){
			this.canSeeThrough = canSeeThrough;
			this.updates.canSeeThrough = true;
			this.hasBeenUpdated();
		}
	};

	CrunchJS.Components.Occupancy.prototype.getUpdates = function() {
		var obj = {};

		goog.object.forEach(this.updates, function(updated, key) {
			if(updated)
				obj[key] = this[key];
		}, this);

		return obj;
	};