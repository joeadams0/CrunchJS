/**
 * @author Joe Adams
 */

goog.provide('Engine.IChannel');

/**
 * The Channel Interface
 * @interface
 * @class The Channel Interface
 */
Engine.IChannel = function() {};
	

/**
 * Recieves messages and forwards them to the listeners
 * @param  {Object} event The message event
 */
Engine.IChannel.prototype.onMessage = function(event) {};

/**
 * Posts an event through the web worker channel
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
Engine.IChannel.prototype.postEvent = function(eventName, data) {};
