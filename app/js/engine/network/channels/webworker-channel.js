/**
 * @author Joe Adams
 */


goog.provide('CrunchJS.Network.Channel.WebWorkerChannel');

goog.require('CrunchJS.Network.Channel.IChannel');
goog.require('goog.array');
goog.require('goog.structs');
goog.require('goog.structs.Set');
goog.require('goog.structs.Map');

/**
 * Creates a Web Worker Channel
 * @param {Worker=} worker The worker to talk to. If the worker is undefined, the channel will assume that the engine is being run in a web worker, and will connect to the postmessage and onmessage that way.
 * 
 * @constructor
 * @class Communicates between Web Workers and Main windows
 * @implements {IChannel}
 */
CrunchJS.Network.Channel.WebWorkerChannel = function(worker) {
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

goog.inherits(CrunchJS.Network.Channel.WebWorkerChannel, CrunchJS.Network.Channel.IChannel);

/**
 * Recieves messages and fires the event into the engine
 * @param  {Object} event The message event
 */
CrunchJS.Network.Channel.WebWorkerChannel.prototype.onMessage = function(event) {
	if(goog.isDefAndNotNull(event.data) && goog.isDefAndNotNull(event.data["eventName"]) ){
		var eventName = event.data["eventName"];
		
		this.onEvent(eventName, event.data['data']);

		// Debug
		if(CrunchJS.DATA_SYNC_DEBUG){
			CrunchJS.world.log(event);
		}
	}
		
};

/**
 * Posts an event through the web worker channel
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
CrunchJS.Network.Channel.WebWorkerChannel.prototype.postEvent = function(eventName, data) {
	var newData = {
		"eventName" : eventName,
		"data" : data
	};


	this.worker.postMessage(newData);
};
