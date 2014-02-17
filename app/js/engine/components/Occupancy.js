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
CrunchJS.Components.Occupancy = function(size) {

	if(size && size.width && size.height){
		/**
		 * Optional size of the occupancy
		 * @type {Boolean}
		 */
		this.size = new goog.math.Size(size.width, size.height);
	}
};

goog.inherits(CrunchJS.Components.Occupancy, CrunchJS.Component);

CrunchJS.Components.Occupancy.prototype.name = "Occupancy";