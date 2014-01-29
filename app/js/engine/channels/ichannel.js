/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.IChannel');

/**
 * The Channel Interface
 * @interface
 * @class The Channel Interface
 */
CrunchJS.IChannel = function() {};
	

/**
 * Recieves messages and forwards them to the listeners
 * @param  {Object} event The message event
 */
CrunchJS.IChannel.prototype.onMessage = function(event) {};

/**
 * Posts an event through the web worker channel
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
CrunchJS.IChannel.prototype.postEvent = function(eventName, data) {};
