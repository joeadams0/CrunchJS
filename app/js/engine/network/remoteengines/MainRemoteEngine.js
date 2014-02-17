/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Network.RemoteEngine.MainRemoteEngine');

goog.require('CrunchJS.Network.RemoteEngine.TrustedRemoteEngine');
goog.require('CrunchJS.Network.Channel.WebWorkerChannel');

/**
 * Creates a Remote Engine in a webworker for the main window. 
 * @constructor
 * @class Remote Engine for the Main Window
 * @extends {CrunchJS.Network.RemoteEngine.TrustedRemoteEngine}
 */
CrunchJS.Network.RemoteEngine.MainRemoteEngine = function() {
	goog.base(this, new CrunchJS.Network.Channel.WebWorkerChannel());

	this._isReady = true;
};

goog.inherits(CrunchJS.Network.RemoteEngine.MainRemoteEngine, CrunchJS.Network.RemoteEngine.TrustedRemoteEngine);