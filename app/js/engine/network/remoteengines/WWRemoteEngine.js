/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Network.RemoteEngine.WWRemoteEngine');

goog.require('CrunchJS.Network.RemoteEngine.TrustedRemoteEngine');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');

/**
 * Creates a Remote Engine for a webworker. 
 * @param {string} path The path to the code to run in the webworker
 * @constructor
 * @class Remote Engine for Web Worker
 * @extends {CrunchJS.Network.RemoteEngine.TrustedRemoteEngine}
 */
CrunchJS.Network.RemoteEngine.WWRemoteEngine = function(path) {
	this._worker = new Worker(path);

	goog.base(this, new CrunchJS.Network.Channel.WebWorkerChannel(this._worker));

	this._isReady = true;
};

goog.inherits(CrunchJS.Network.RemoteEngine.WWRemoteEngine, CrunchJS.Network.RemoteEngine.TrustedRemoteEngine);

