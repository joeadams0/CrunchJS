/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.Impulse');

goog.require('CrunchJS.Component');

/**
 * Contains data about the velocity and the force on the object. 
 * @param {Object}  velocity  The Velocity of the component
 * @param {Object}  force     The force on the object
 * @constructor
 * @class 
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Impulse = function(velocity, force) {

	/**
	 * The velocity of the entity	
	 * @type {Object}
	 */
	this.velocity = velocity ? velocity : {
		x : 0,
		y : 0
	};

	/**
	 * The force on the entity
	 * @type {Object}
	 */
	this.force = force ? force : {
		x : 0,
		y : 0
	}
};

goog.inherits(CrunchJS.Components.Impulse, CrunchJS.Component);

CrunchJS.Components.Impulse.prototype.name = 'Impulse';