/**
 * @author Joe Adams
 */

goog.provide('Engine');


/**
 * Creates a new instance of the Engine
 * @param {(Object|string)=} config The configurations for the engine.
 * @param {boolean=} config.webworker Enable running simulation in a webworker (if supported by browser) for increased performance
 * @class The Game Engine object
 * @constructor
 *
 * @example
 * // Create an engine that uses a webworker for the simulation
 * var engine = new Engine({
 *   webworker : true
 * });
 */
Engine = function(config) {

};

/**
 * Creates an entity 
 * @return {number} The id of the entity
 * @example
 * // Create the engine
 * var engine = new Engine();
 *
 * // Create a new entity
 * var entityId = engine.createEntity();
 */
Engine.prototype.createEntity = function() {

};

/**
 * Destroys the entity
 * @param  {number} entityId The entity Id
 */
Engine.prototype.destroyEntity = function(entityId) {

};

/**
 * Adds a system to the world. The order that systems are added to the engine is the order the will be updated in.
 * @param {Engine.System} system The System to add to the Engine
 * @example
 * // Create the engine
 * var engine = new Engine();
 * 
 * // Create a simple system
 * 
 * // Then add it to the Engine
 * engine.addSystem(system);
 * 
 */
Engine.prototype.addSystem = function(system) {

};

/** 
 * Removes the system from the world.	
 * @param  {string} systemId The system identifier
 */
Engine.prototype.removeSystem = function(systemId) {};

/**
 * Adds a component to the entity corresponding to the given id.
 * @param {number} entityId  The Entity Id
 * @param {Engine.Component} component The component to add
 *
 * @exapmle
 * // Create the engine
 * var engine = new Engine();
 *
 * // Create the component
 * var component = new Component1();
 *
 * // Create the Entity
 * var entityId = engine.createEntity();
 *
 * // Add Component to the entity
 * engine.addComponent(entityId, component);
 */
Engine.prototype.addComponent = function(entityId, component) {


/**
 * Removes the component from the entity
 * @param  {number} entityId            The entity id
 * @param  {string} componentIdentifier The component id
 */
Engine.prototype.removeComponent = function(entityId, componentIdentifier) {};

};