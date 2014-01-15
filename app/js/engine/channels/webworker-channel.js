/**
 * @author Joe Adams
 */


goog.provide('Engine.WebWorkerChannel');

goog.require('Engine.IChannel');
goog.require('goog.array');

/**
 * Creates a Web Worker Channel
 * @param {Worker=} worker The worker to talk to. If the worker is undefined, the channel will assume that the engine is being run in a web worker, and will connect to the postmessage and onmessage that way.
 * 
 * @constructor
 * @class Communicates between Web Workers and Main windows
 * @implements {IChannel}
 */
Engine.WebWorkerChannel = function(worker) {
	/**
	 * The Worker to listen for messages from. All the worker needs are postmessage and onmessage functions.
	 * @type {Worker}
	 */
	this.worker = null;

	if(goog.isDefAndNotNull(worker))
		this.worker = worker;
	else
		this.worker = goog.global;

	/**
	 * A map of actions to arrays of listeners 
	 * @type {Object}
	 * @private
	 */
	this._listeners = {};

	var fun = goog.bind(this.onMessage, this);

	this.worker.onmessage = fun;
};

goog.inherits(Engine.WebWorkerChannel, Engine.IChannel);

/**
 * Recieves messages and forwards them to the listeners
 * @param  {Object} event The message event
 */
Engine.WebWorkerChannel.prototype.onMessage = function(event) {
	if(goog.isDefAndNotNull(event.data) && goog.isDefAndNotNull(event.data["eventName"]) && event.data["eventName"] in this._listeners)
		var eventName = event.data["eventName"];
		goog.array.forEach(this._listeners[eventName], function(el, index, array) {
			if(goog.isFunction(el))
				el(event);
		});
};

/**
 * Posts an event through the web worker channel
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
Engine.WebWorkerChannel.prototype.postEvent = function(eventName, data) {
	var newData = {
		"eventName" : eventName,
		data : data
	};

	this.worker.postMessage(newData);
};

/**
 * Listens for an event from the other side of the channel.
 * @param  {string} eventName The name of the event to listen for
 * @param  {Function} fun     The function to call when the event happens
 */
Engine.WebWorkerChannel.prototype.addListener = function(eventName, fun) {
	if(!(eventName in this._listeners))
		this._listeners[eventName] = [];

	this._listeners[eventName].push(fun);
};

/**
 * Removes a listener for an event.
 * @param  {string} eventName The name of the event
 * @param  {Function} fun       The listener to remove
 */
Engine.WebWorkerChannel.prototype.removeListener = function(eventName, fun) {
	if(eventName in this._listeners){
		goog.array.remove(this._listeners[eventName], fun);
	}
};

/**
 * Gets the Listeners for an event.
 * @param  {string} eventName The name of the event
 * @return {Array<Function>}           An array of listeners
 */
Engine.WebWorkerChannel.prototype.getListeners = function(eventName) {
	return this._listeners[eventName];
};

/**
 * Removes all of the listeners for an event
 * @param  {string} eventName The name of the event
 */
Engine.WebWorkerChannel.prototype.removeAllListeners = function(eventName) {
	this._listeners[eventName] = [];
};