/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Network.RemoteEngine.TrustedRemoteEngine');

goog.require('CrunchJS.Network.RemoteEngine.AbstractRemoteEngine');


/**
 * Creates a trusted remote engine. Trusted remote engines have the ability to tell your 
 * engine to create, destroy, change, enable or disable you entities, as well as start
 * or pause your engine.
 * @param {CrunchJS.Network.Channel.IChannel} channel The channel for the engine
 * @constructor
 * @class TrustedRemoteEngine
 * @extends {CrunchJS.Network.RemoteEngine.AbstractRemoteEngine}
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine = function(channel) {
	goog.base(this, channel);


	// Add the listeners
	this.addEventListener(CrunchJS.EngineCommands.Run, goog.bind(this.onRun, this));
	this.addEventListener(CrunchJS.EngineCommands.Pause, goog.bind(this.onPause, this));
	this.addEventListener(CrunchJS.EngineCommands.SyncRequest, goog.bind(this.onSyncRequest, this));
	this.addEventListener(CrunchJS.EngineCommands.Sync, goog.bind(this.onSync, this));
	this.addEventListener(CrunchJS.EngineCommands.Write, goog.bind(this.onWrite, this));
	this.setDefaultListener(goog.bind(this.defaultListener, this));
};

goog.inherits(CrunchJS.Network.RemoteEngine.TrustedRemoteEngine, CrunchJS.Network.RemoteEngine.AbstractRemoteEngine);

/**
 * Starts the remote engine
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.run = function() {
	this.postEvent(CrunchJS.EngineCommands.Run);
};

/**
 * Pauses the remote engine
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.pause = function() {
	this.postEvent(CrunchJS.EngineCommands.Pause);
};

/**
 * Creates an entity in the remote engine
 * @param  {number} id The id of the entity to create
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.createEntity = function(id) {
	this.postEvent(CrunchJS.EngineCommands.CreateEntity, id);
};

/**
 * Destroys an entity in the remote engine
 * @param  {number} id The id of the entity to destroy
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.destroyEntity = function(id) {
	this.postEvent(CrunchJS.EngineCommands.DestroyEntity, id);
};

/**
 * Changes an entity in the remote system
 * @param  {Object} data Data describing the nature of the change
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.changeEntity = function(data) {
	this.postEvent(CrunchJS.EngineCommands.UpdateComponent, data);
};

/**
 * Enables an entity in the remote system
 * @param  {number} id The id of the entity to enable
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.enableEntity = function(id) {
	this.postEvent(CrunchJS.EngineCommands.EnableEntity, id);
};

/**
 * Disables an entity in the remote system
 * @param  {number} id The id of the entity to disable
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.disableEntity = function(id) {
	this.postEvent(CrunchJS.EngineCommands.DisableEntity, id);
};

/**
 * Requests a complete sync to be sent from the remote engine
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.completeSyncRequest = function() {
	this.postEvent(CrunchJS.EngineCommands.SyncRequest);
};

/**
 * Tells the other engine to write the data to the console
 * @param  {Object} data Data to write
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.write = function(data) {
	this.postEvent(CrunchJS.EngineCommands.Write, data);
};

/**
 * Start the engine, unless it is already running
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.onRun= function() {
	if(!CrunchJS.world.isRunning())
		CrunchJS.world.run();
};

/**
 * Pauses the engine, unless already paused
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.onPause = function() {
	if(CrunchJS.world.isRunning())
		CrunchJS.world.pause();
};

/**
 * Fires the event into the engine
 * @param  {number} id The id of the entity to create
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.defaultListener = function(eventName, data) {
	CrunchJS.world.fireEvent(eventName, data);
};

/**
 * Sends the sync data
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.onSyncRequest = function() {
	CrunchJS.world.fireEvent(CrunchJS.EngineCommands.SyncRequest);
};

/**
 * Syncs the data with our system
 * @param  {Object} data The sync data
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.onSync = function(data) {
	CrunchJS.world.fireEvent(CrunchJS.EngineCommands.Sync, data);
};

/**
 * Writes the data
 * @param {Object} data Data to write
 */
CrunchJS.Network.RemoteEngine.TrustedRemoteEngine.prototype.onWrite = function(data) {
	CrunchJS.world.write(data);
};

