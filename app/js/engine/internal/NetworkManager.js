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
	peer.on('open', this.peerOnOpen.bind(this));
	peer.on('connection', this.onConnectionOnData.bind(this));
	
	this.peer = peer;
};

/**
 * Function for when a peer opens a connection
 * @param {string} id peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.peerOnOpen = function(id) {
	//record the generated ID
	this.peerId = id;
	console.log("PeerJS ID: " + this.peerId);
	this.probeHost();
}

/**
 * Function for when a peer has an error
 * @param {Object} err An err object
 */
CrunchJS.Internal.NetworkManager.prototype.peerOnError = function(err) {



}
 
/**
 * Sets up data handling on a connection
 * @param {Object} conn Connection object on which data collection is defined
 */
CrunchJS.Internal.NetworkManager.prototype.onConnectionOnData = function(conn) {
	//define data handling function
	conn.on('data', function(data){
		if(data['type'] == 'connect')
		{
			var otherPeer = data['data'];
			
			//If I am the host, I should tell everybody to connect to this person
			if(this.peerId == 'host')
			{
				for (var i=0;i<this.connections.length;i++)
				{
					this.connections[i].send({'type': 'should_connect', 'data': otherPeer});
				}
			}
			
			//If somebody connected to me then I should connect back (if necessary).
			if(this.connectedPeers.indexOf(otherPeer) == -1)
			{
				this.connect(otherPeer);
				console.log("I am reciprocating a conn with: " + otherPeer);
			}
		}
		else if(data['type'] == 'should_connect')
		{
			//The host will broadcast new players to everybody and say that they should connect
			var otherPeer = data['data'];
			if(this.connectedPeers.indexOf(otherPeer) == -1)
			{
				this.connect(otherPeer);
				console.log("Host told me to create a conn with: " + otherPeer);
			}
		}
		else
		{
			console.log("GOT DATA: " + data);
		}
	}.bind(this));
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
CrunchJS.Internal.NetworkManager.prototype.probeHost = function()
{
	//try to connect to host
	//if there is no host, you become the host
	if(this.isHost(this.pId) == false)
	{
		this.connect('host');
	}
};

CrunchJS.Internal.NetworkManager.prototype.contains = function(list, item) {
    var i = list.length;
	//decreasing while loop is faster than others in JS
    while (i--) {
       if (list[i] === item) {
           return true;
       }
    }
    return false;
};

/**
 * Connect to a new peer
 * @param {string} pId A remote peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.connect = function(pId)
{
	console.log("Trying to connect to: " + pId);
	var conn = this.peer.connect(pId);
	//open a connection
	conn.on('open', function(){
		console.log("Connected to: " + pId);
		//Tell the peer that you want to connect with him.
		conn.send({'type':'connect','data':this.peerId});
		//Save the connection.
		this.connectedPeers.push(pId);
		this.connections.push(conn);
	}.bind(this));
	setTimeout(function()
	{
		console.log("I have connections to these peers...");
		console.log(this.connectedPeers);
		if(this.contains(this.connectedPeers, pId) == false)
		{
			console.log("Could not connect to: " + pId);
			
			if(pId == 'host')
			{
				//become host
				this.initialize(true);
			}
		}
	}.bind(this), 2500);
};