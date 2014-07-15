/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Internal.EventManager');

goog.require('goog.array');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');

/**
 * Creates an Event Manager object
 * @constructor
 * @class The Event Manager Object
 */
CrunchJS.Internal.EventManager = function() {
	/**
	 * A map of actions to arrays of listeners 
	 * @type {goog.structs.Map}
	 * @private
	 */
	this._eventListeners = new goog.structs.Map();

	/**
	 * A set of listeners for all events
	 * @type {goog.structs.Set}
	 */
	this._listeners = new goog.structs.Set();

	/**
	 * The default listener. If an event doest have any listeners, the default listener is fired
	 * @type {Function}
	 */
	this._defaultListener = null;
};


/**
 * Fires an event to the managers listeners
 * @param  {String} eventName The name of the event
 * @param  {Object} eventData The event data
 */
CrunchJS.Internal.EventManager.prototype.fireEvent = function(eventName, eventData) {
	var listeners = this.getEventListeners(eventName),		
		fired = false;
	if(goog.isDefAndNotNull(eventName)){

		if(goog.isDefAndNotNull(listeners)){

			// Event listeners
			goog.structs.forEach(listeners, function(el, index, array) {

				if(goog.isFunction(el)){
					fired = true;
					el(eventData);
				}

			});
		}

		if(!fired && goog.isDefAndNotNull(this._defaultListener))
			this._defaultListener(eventName, eventData);

		// All event listeners
		goog.structs.forEach(this._listeners, function(listener){
			if(goog.isFunction(listener))
				listener(eventName, eventData);
		})
	}
};

/**
 * Listens for an event 
 * @param  {string} eventName The name of the event to listen for
 * @param  {Function} fun     The function to call when the event happens
 */
CrunchJS.Internal.EventManager.prototype.addEventListener = function(eventName, fun) {
	var set;

	if(!(this.hasEventName(eventName))){
		set = new goog.structs.Set();
		this._eventListeners.set(eventName, set);
	}
	else{
		set = this.getEventListeners(eventName);
	}

	set.add(fun);
};

/**
 * Adds a listener to listen for all events
 * @param {Function} listener The listener
 */
CrunchJS.Internal.EventManager.prototype.addListener = function(listener) {
	this._listeners.add(listener);
};

/**
 * Removes a listener for an event.
 * @param  {string} eventName The name of the event
 * @param  {Function} fun       The listener to remove
 * @return {Boolean} True if the listener was found and removed
 */
CrunchJS.Internal.EventManager.prototype.removeEventListener = function(eventName, fun) {
	return this.getEventListeners(eventName).remove(fun);
};

/**
 * Removes a listener for all events
 * @param {Function} listener The listener
 */
CrunchJS.Internal.EventManager.prototype.removeListener = function(listener) {
	this._listeners.remove(listener);
};


/**
 * Checks if we have an event type
 * @param  {string}  eventName The name of the event
 * @return {Boolean}           True if we have the event type
 */
CrunchJS.Internal.EventManager.prototype.hasEventName = function(eventName) {
	return this._eventListeners.containsKey(eventName);
};

/**
 * Gets the Listeners for an event.
 * @param  {string} eventName The name of the event
 * @return {Array<Function>}           An array of listeners
 */
CrunchJS.Internal.EventManager.prototype.getEventListeners = function(eventName) {
	return this._eventListeners.get(eventName);
};


/**
 * Removes all of the listeners for an event
 * @param  {string} eventName The name of the event
 */
CrunchJS.Internal.EventManager.prototype.removeAllListeners = function(eventName) {
	this.getEventListeners(eventName).removeAll(this.getEventListeners(eventName));
};

/**
 * Sets the default listener. If there are no listeners for an event, then it fires the default
 * @param {Function} listener The listener
 */
CrunchJS.Internal.EventManager.prototype.setDefaultListener = function(listener) {
	this._defaultListener = listener;
};