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


	var fun = goog.bind(this.onMessage, this);

	this.worker.onmessage = fun;
};

goog.inherits(Engine.WebWorkerChannel, Engine.IChannel);

/**
 * Recieves messages and fires the event into the engine
 * @param  {Object} event The message event
 */
Engine.WebWorkerChannel.prototype.onMessage = function(event) {
	if(goog.isDefAndNotNull(event.data) && goog.isDefAndNotNull(event.data["eventName"]) ){
		var eventName = event.data["eventName"];
		// Fire the evetn in the engine
		console.log("Recieved :",event);
		Engine.engine.fireEvent(eventName, event.data['data']);
	}
		
};

/**
 * Posts an event through the web worker channel
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
Engine.WebWorkerChannel.prototype.postEvent = function(eventName, data) {
	var newData = {
		"eventName" : eventName,
		"data" : data
	};

	console.log("Posting: ",newData);

	this.worker.postMessage(newData);
};
