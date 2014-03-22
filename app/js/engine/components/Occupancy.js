/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Occupancy');

goog.require('CrunchJS.Component');
goog.require('goog.math.Size');

/**
 * Creates an Occupancy Component. This component is used to define the characteristics of an entity being placed on an occupancy map.
 * @param {Object} size     If this is set, it will be the size that the entity will occupy on the map, instead of the Body Components size. This should have size.width and size.height defined
 * @constructor
 * @class 
 */
CrunchJS.Components.Occupancy = function(params) {
	goog.base(this, params);

	if(params && params.size && params.size.width && params.size.height){
		/**
		 * Optional size of the occupancy
		 * @type {Boolean}
		 */
		this.size = new goog.math.Size(params.size.width, params.size.height);
	}
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

CrunchJS.Components.Occupancy.prototype.getUpdates = function() {
	if(this.updates.size && goog.isDefAndNotNull(this.getSize())){
		return {
			width : this.getSize().width,
			height : this.getSize().height
		};
	}
	return {};
};

CrunchJS.Components.Occupancy.prototype.toObj = function() {
	var obj = goog.base(this, 'toObj', {});

	if(goog.isDefAndNotNull(this.getSize())){
		obj.size = {};
		obj.size.width = this.getSize().width;
		obj.size.height = this.getSize().height;
	}
	return obj;
};