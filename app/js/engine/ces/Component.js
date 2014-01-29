/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Component');

/**
 * This class is the basic component class. Components are added to entities to store state. They are best used to only store data, and to not perform logic. Systems are desgined to perform all logic for components. This distinction makes syncing data much easier.
 * All a component needs is the name property, and all components will be given an entityId field which will be the entity id that contains it. 
 * @class The Abstract Component Class
 * @constructor
 * @abstract
 * @example
 * // Create the world
 * var world = new CrunchJS.World();
 *
 * // Set the name property, so the world knows what type of component it is
 * var positionComponent = {
 *   name : 'Position'
 * };
 *
 * // Set some fields for the component
 * positionComponent.x = 10;
 * positionComponent.y = 20;
 *
 * var entityId = world.createEntity();
 *
 * world.addComponent(entityId, positionComponent);
 *
 * // 10
 * world.getComponent(entityId, 'Position').x
 *
 * @example
 * // Create the world
 * var world = new CrunchJS.World();
 *
 * // Create a Position Component Constructor to create the components for us
 * var PositionComponent = function(x,y){
 *   this.x = x;
 *   this.y = y;
 * };
 *
 * // Give the prototype a property, so that all instances will have it
 * PositionComponent.prototype.name = "Position";
 *
 * var pos1 = new PositionComponent(10, 20);
 * var pos2 = new PositionComponent(30, 40);
 *
 * var entity1 = world.createEntity();
 * var entity2 = world.createEntity();
 *
 * // Add the components to the entities
 * world.addComponent(entity1, pos1);
 * world.addComponent(entity2, pos2);
 *
 * // 10
 * world.getComponent(entity1, 'Position').x;
 *
 * // 30
 * world.getComponent(entity2, 'Position').x
 */
CrunchJS.Component = function() {
};

/**
 * The entity id that this component is a part of
 * @type {Number}
 */
CrunchJS.Component.prototype.entityId = null;

 