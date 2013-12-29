/**
 * @author Joe Adams
 */

goog.provide('Engine.System');

/**
 * This class shows all of the possible properties a system could have. Systems are designed to perform all of the game logic. 
 * Please note, unlike Java, you can implement as many of these functions as you like. You do not need to implement them all. The only required property is the __identifier property. Warning: DO NOT INSTANTIATE.
 * @class The Sytem Template
 * @example
 * // Create the engine
 * var engine = new Engine.Core();
 *
 * // Create a system
 * var physicsSystem = {
 *   __identifier : "Physics"
 * };
 *
 * physicsSystem.update = function(frame){
 *   ....
 * }
 *
 * engine.addSystem(physicsSystem);
 */
Engine.System = {}
/**
 * A function to update all entities in the system. Called every simulation frame.
 * @param  {Engine.Core.Frame} frame The current frame
 */
Engine.System.prototype.update = function(frame) {};

/**
 * The Unique Identifier for the system
 * @type {string}
 */
Engine.System.prototype.__identifier;
