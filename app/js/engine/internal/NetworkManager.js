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

/**
 * Called to activate the Network Manager
 */
CrunchJS.Internal.NetworkManager.prototype.activate = function() {
	goog.base(this, 'activate');
	this.initialize(false);
};

/**
 * Deactivates the Network Manager
 */
CrunchJS.Internal.NetworkManager.prototype.deactivate = function() {
	goog.base(this, 'deactivate');
};

/**
 * Initializes background tasks for the Network Manager.
 * @param {boolean} createHost A boolean to determine if the host should be created
 */
CrunchJS.Internal.NetworkManager.prototype.initialize = function(createHost)
{
	//only run Network Manager in main window
	if(typeof(Peer) === 'undefined')
	{
		return;
	}
	var peer = null;
	if(createHost)
	{
		peer = new Peer("host", {key: this.apiKey});
	}
	else
	{
		peer = new Peer({key: this.apiKey});
	}
	//on a connection
	peer.on('open', function(id) {
		//record the generated ID
		this.peerId = id;
		console.log("PeerJS ID: " + this.peerId);
		if(this.isHost() == false && this.becomeHost())
		{
			this.initialize(true);
		}
	}.bind(this));
	peer.on('connection', this.onConnectionOnData.bind(this));
	
	this.peer = peer;
};

/**
 * Sets up data handling on a connection
 * @param {Object} conn Connection object on which data collection is defined
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
		else if(data['type'] == 'should_connect')
		{
			//The host will broadcast new players to everybody and say that they should connect
			var otherPeer = data['data'];
			if(this.connectedPeers.indexOf(otherPeer) == -1)
			{
				this.connect(peer, otherPeer);
				console.log("Host told me to create a conn with: " + otherPeer);
			}
		}
		else
		{
			console.log("GOT DATA: " + data);
		}
	});
};

/**
 * Checks the peer ID to see if this is the host
 * @return {boolean} Whether this is the host or not
 */
CrunchJS.Internal.NetworkManager.prototype.isHost = function()
{
	if(this.peerId == "host")
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
 * Checks if there is not a host
 * @return {boolean} Whether this peer should become the host or not
 */
CrunchJS.Internal.NetworkManager.prototype.becomeHost = function()
{
	//try to connect to host
		
	//if there is no host, you become the host
	console.log("There is no host.  You should become the host.");
	return true;
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
