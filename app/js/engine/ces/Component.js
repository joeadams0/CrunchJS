/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Component');

/**
 * This class is the basic component class. Components are added to entities to store state. They are best used to only store data, and to not perform logic. Systems are desgined to perform all logic for components. This distinction makes syncing data much easier.
 * All a component needs is the name property, and all components will be given an entityId field which will be the entity id that contains it. 
 * @class The Abstract Component Class
 * @constructor
 * @example
 *
 * goog.provide('CrunchJS.Component');
 * 
 * var Position = function(x,y){
 * 	// Initialize here
 * 	this.x = x;
 * 	this.y = y;
 * }
 *
 * goog.inherits(Position, CrunchJS.Component);
 *
 * // Always ad the name field
 * Position.prototype.name = 'Position';
 *
 *
 * var world = new CrunchJS.World();
 *
 * var entityId = world.createEntity();
 * 
 * var pos1 = new Position(10, 20);
 *
 * world.addComponent(entityId, pos1);
 *
 * // True
 * world.getComponent(entityId, 'Position').x == 10;
 */
CrunchJS.Component = function() {
};

/**
 * The entity id that this component is a part of
 * @type {Number}
 */
CrunchJS.Component.prototype.entityId = null;

 