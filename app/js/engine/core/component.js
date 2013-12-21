/**
 * @author Joe Adams
 */

goog.provide('Engine.Component');

/**
 * This class shows the basic template of a component. Components are designed to only store data. No logic should be performed in them. That is what Systems are for.
 * All a component needs is the __identifer property. Warning: DO NOT INSTANTIATE
 * @class The Component Template
 * @example
 * // Create the engine
 * var engine = new Engine();
 *
 * // Set the __identifier property, so the engine knows what type of component it is
 * var positionComponent = {
 *   __identifier : 'Position'
 * };
 *
 * // Set some fields for the component
 * positionComponent.x = 10;
 * positionComponent.y = 20;
 *
 * var entityId = engine.createEntity();
 *
 * engine.addComponent(entityId, positionComponent);
 *
 * // 10
 * engine.getComponent(entityId, 'Position').x
 *
 * @example
 * // Create the engine
 * var engine = new Engine();
 *
 * // Create a Position Component Constructor to create the components for us
 * var PositionComponent = function(x,y){
 *   this.x = x;
 *   this.y = y;
 * };
 *
 * // Give the prototype a property, so that all instances will have it
 * PositionComponent.prototype.__identifier = "Position";
 *
 * var pos1 = new PositionComponent(10, 20);
 * var pos2 = new PositionComponent(30, 40);
 *
 * var entity1 = engine.createEntity();
 * var entity2 = engine.createEntity();
 *
 * // Add the components to the entities
 * engine.addComponent(entity1, pos1);
 * engine.addComponent(entity2, pos2);
 *
 * // 10
 * engine.getComponent(entity1, 'Position').x;
 *
 * // 30
 * engine.getComponent(entity2, 'Position').x
 */
Engine.Component = {};


/**
 * Tells the engine what type of Component this is.
 * @type {string}
 */
Component.__identifier;