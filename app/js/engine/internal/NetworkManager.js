/**
 * @author Joshua Schwarz
 */

goog.provide('CrunchJS.Internal.NetworkManager');

goog.require('CrunchJS.Internal.Manager');

/**
 * Creates a new Network Manager
 * @constructor
 * @class Manages Network Communication for CrunchJS (for internal use)
 * @this {CrunchJS.Internal.NetworkManager}
 */
CrunchJS.Internal.NetworkManager = function(scene) {
	goog.base(this, scene);
	/**
	 * API key for PeerJS-Server
	 * @type {string}
	 */
	this.apiKey = 'i45z4s9chvv7k3xr';
	
	/**
	 * The string ID of this peer
	 * @type {string}
	 */
	this.peerId = '';
	
	/**
	 * Peer object
	 * @type {Object}
	 */
	this.peer = null;
	
	/**
	 * Peers to which this peer is connected
	 * @type {Array}
	 */
	this.connectedPeers = [];
	
	/**
	 * Connection objects for connected peers
	 * @type {Array}
	 */
	 this.connections = [];
	 
	 return this;
};

goog.inherits(CrunchJS.Internal.NetworkManager, CrunchJS.Internal.Manager);

CrunchJS.Internal.NetworkManager.prototype.getPeerId = function() {
	return this.peerId;
};

/**
 * Called to activate the Network Manager
 */
CrunchJS.Internal.NetworkManager.prototype.activate = function() {
	goog.base(this, 'activate');
	this.initialize();
};

/**
 * Deactivates the Network Manager
 */
CrunchJS.Internal.NetworkManager.prototype.deactivate = function() {

};


CrunchJS.Internal.NetworkManager.prototype.initialize = function()
{
	var peer = new Peer({key: this.apiKey});
	//on a connection
	peer.on('open', function(id) {
		//record the generated ID
		this.peerId = id;
		console.log("PeerJS ID: " + this.peerId);
	});
	peer.on('connection', this.onConnectionOnData);
	this.peer = peer;
};

/**
 *
 *
 */
CrunchJS.Internal.NetworkManager.prototype.onConnectionOnData = function(conn) {
	//define data handling function
	conn.on('data', function(data){
		if(data['type'] == 'connect')
		{
			//If somebody connected to me then I should connect back (if necessary).
			var otherPeer = data['data'];
			if(this.connectedPeers.indexOf(otherPeer) == -1)
			{
				this.connect(peer, otherPeer);
				console.log("I am reciprocating a conn with: " + otherPeer);
			}
		}
		else
		{
			console.log("GOT DATA: " + data);
		}
	});
};

/**
 * Connect to a new peer
 * @param {string} pId A remote peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.connect = function(pId)
{
	var conn = this.peer.connect(pId);
	//open a connection
	conn.on('open', function(){
		//Tell the peer that you want to connect with him.
		conn.send({'type':'connect','data':this.peerId});
		//Save the connection.
		connected.push(pId);
		connections.push(conn);
	});
};
