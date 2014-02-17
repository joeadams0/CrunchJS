/**
 * @author Joe Adams
 * @namespace CrunchJS.Network.RemoteEngine
 * @description These objects abstract away communicating with remote engine instances, such as on another pc or in a webworker.
 */

goog.provide('CrunchJS.Network.RemoteEngine');
goog.provide('CrunchJS.Network.RemoteEngine.AbstractRemoteEngine');

goog.require('CrunchJS.Internal.EventManager');

/**
 * Creates an AbstractRemoteEngine. This is the most basic type of remote engine, and not very useful unless extended.
 * @param {CrunchJS.Network.Channel.IChannel} iChannel The channel connected to the remote engine
 * @constructor
 * @class The Abstract Remote Engine Class
 * @extends {CrunchJS.Internal.EventManager}
 */
CrunchJS.Network.RemoteEngine.AbstractRemoteEngine = function(iChannel) {

	goog.base(this);

	/**
	 * The channel connected to the remote engine
	 * @type {CrunchJS.Network.Channel.IChannel}
	 */
	this._channel = iChannel;

	/**
	 * Tells if the remote engine is ready
	 * @type {Boolean}
	 */
	this._isReady = false;

	/**
	 * The events for the remote engine
	 * @type {Object}
	 */
	this.Events = {};

	/**
	 * Fired when the remote engine is ready
	 * @type {String}
	 */
	this.Events.Ready = 'remote_engine_ready';

	// Set up the channel
	// By default, the events coming from the channel go into this object's event
	// manager and events being posted go into the channel
	this._channel.onEvent = goog.bind(this.fireEvent, this);



};

goog.inherits(CrunchJS.Network.RemoteEngine.AbstractRemoteEngine, CrunchJS.Internal.EventManager);

/**
 * Gets the channel
 * @return {CrunchJS.Network.Channel.IChannel} The channel
 * @protected
 */
CrunchJS.Network.RemoteEngine.AbstractRemoteEngine.prototype.getChannel = function() {
	return this._channel;
};

/**
 * Checks if the remote engine is ready
 * @return {Boolean} True if the channel is ready
 */
CrunchJS.Network.RemoteEngine.AbstractRemoteEngine.prototype.isReady = function() {
	return this._isReady;
};

/**
 * Posts an event through to the engine
 * @param  {string} eventName The event name
 * @param  {Object} data      The data to send
 */
CrunchJS.Network.RemoteEngine.AbstractRemoteEngine.prototype.postEvent = function(eventName, data) {
	this._channel.postEvent(eventName, data);
};
