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

/**
 * Listens for an event from the other side of the channel.
 * @param  {string} eventName The name of the event to listen for
 * @param  {Function} fun     The function to call when the event happens
 */
Engine.IChannel.prototype.addListener = function(eventName, fun) {};

/**
 * Removes a listener for an event.
 * @param  {string} eventName The name of the event
 * @param  {Function} fun       The listener to remove
 */
Engine.IChannel.prototype.removeListener = function(eventName, fun) {};

/**
 * Gets the Listeners for an event.
 * @param  {string} eventName The name of the event
 * @return {Array<Function>}           An array of listeners
 */
Engine.IChannel.prototype.getListeners = function(eventName) {};

/**
 * Removes all of the listeners for an event
 * @param  {string} eventName The name of the event
 */
Engine.IChannel.prototype.removeAllListeners = function(eventName) {};