/**
 * @author Joe Adams
 */

goog.provide('Engine.EventManager');

goog.require('goog.array');


/**
 * Creates an Event Manager object
 * @constructor
 * @class The Event Manager Object
 */
Engine.EventManager = function() {
	/**
	 * A map of actions to arrays of listeners 
	 * @type {Object}
	 * @private
	 */
	this._listeners = {};
};

Engine.EventManager.prototype.fireEvent = function(eventName, eventData) {
	if(goog.isDefAndNotNull(eventName) && goog.isDefAndNotNull(this._listeners[eventName])){
		goog.array.forEach(this._listeners[eventName], function(el, index, array) {
			if(goog.isFunction(el))
				el(eventData);
		});
	}
};

/**
 * Listens for an event from the other side of the channel.
 * @param  {string} eventName The name of the event to listen for
 * @param  {Function} fun     The function to call when the event happens
 */
Engine.EventManager.prototype.addListener = function(eventName, fun) {
	if(!(eventName in this._listeners))
		this._listeners[eventName] = [];

	this._listeners[eventName].push(fun);
};

/**
 * Removes a listener for an event.
 * @param  {string} eventName The name of the event
 * @param  {Function} fun       The listener to remove
 */
Engine.EventManager.prototype.removeListener = function(eventName, fun) {
	if(eventName in this._listeners){
		goog.array.remove(this._listeners[eventName], fun);
	}
};

/**
 * Gets the Listeners for an event.
 * @param  {string} eventName The name of the event
 * @return {Array<Function>}           An array of listeners
 */
Engine.EventManager.prototype.getListeners = function(eventName) {
	return this._listeners[eventName];
};

/**
 * Removes all of the listeners for an event
 * @param  {string} eventName The name of the event
 */
Engine.EventManager.prototype.removeAllListeners = function(eventName) {
	this._listeners[eventName] = [];
};