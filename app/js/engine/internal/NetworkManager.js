/**
 * @author Joshua Schwarz
 */

goog.provide('CrunchJS.Internal.NetworkManager');

/**
 * Creates a new Network Manager
 * @constructor
 * @class Manages Network Communication for CrunchJS (for internal use)
 * @this {CrunchJS.Internal.NetworkManager}
 */
CrunchJS.Internal.NetworkManager = function() {
	/**
	 * The string ID of this peer
	 * @type {string}
	 */
	this.peerId = '';
	
	/**
	 * Peers to which this peer is connected
	 * @type {Array}
	 * @protected
	 */
	this.connectedPeers = [];
};

/**
 * Checks if a peer is in the connected peers list
 * @return {boolean} True or false
 * @param {string} pId A peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.isConnected = function(pId)
{
	for(var k in this.connectedPeers)
	{
		if(k == pId)
		{
			return true;
		}
	}
	return false;
};

/**
 * Connects to a new peer
 * @param {string} pId A peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.connect = function(pId)
{
	
};

/**
 * Inserts peer ID into connected peers list
 * @param {string} pId The peer ID of a newly connected peer
 * @param {Object} peerConnection The peerJS object for the connection
 */
CrunchJS.Internal.NetworkManager.prototype.addPeer = function(pId, peerConnection)
{
	this.connectedPeers[pId] = peerConnection;
};
