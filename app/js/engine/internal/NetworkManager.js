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
	 
	 this.getScene().addEventListener(CrunchJS.Events.SendNetworkCommand, goog.bind(this.sendNetworkCommand, this));
};

goog.inherits(CrunchJS.Internal.NetworkManager, CrunchJS.Internal.Manager);

/**
 * Sends a network command
 * @param {Object} data The event data
 */
CrunchJS.Internal.NetworkManager.prototype.sendNetworkCommand = function(data) {
	this.sendMessageToAllPeers({'type':'command', 'data':data});
};

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
	if(CrunchJS.world.isSim())
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
	this.log("PeerJS ID: " + this.peerId, CrunchJS.LogLevels.DEBUG);
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
 * Can handle data of type 'connect', 'should_connect', and unlabeled.
 * @param {Object} conn Connection object on which data collection is defined
 */
CrunchJS.Internal.NetworkManager.prototype.onConnectionOnData = function(conn) {
	//define data handling function
	conn.on('data', function(data){
		if(data['type'] == 'connect')
		{
			this.connectMessageLogic(data);
		}
		else if(data['type'] == 'should_connect')
		{
			this.shouldConnectMessageLogic(data);
		}
		else if(data['type'] == 'command')
		{
			this.log("Data from " + conn.peer + ": " + data['data'], CrunchJS.LogLevels.DEBUG);
			//FIRE EVENTS TO PASS DATA
		}
	}.bind(this));
};

/**
 * Helper for the logic for a "connect" message
 * @param {Object} data JSON object identified as a "connect" message
 */
CrunchJS.Internal.NetworkManager.prototype.connectMessageLogic = function(data)
{
	var otherPeer = data['data'];
			
	//If I am the host, I should tell everybody to connect to this person
	if(this.peerId == 'host')
	{
		var message = this.createShouldConnectMessage(otherPeer);
		this.sendMessageToAllPeers(message);
	}
	
	//If somebody connected to peer then it should connect back.
	if(this.connectedPeers.indexOf(otherPeer) == -1)
	{
		this.connect(otherPeer);
		this.log("I am reciprocating a conn with: " + otherPeer, CrunchJS.LogLevels.DEBUG);
	}
};

/**
 * Helper for the logic for a "should_connect" message
 * @param {Object} data JSON object identified as a "should_connect" message
 */
CrunchJS.Internal.NetworkManager.prototype.shouldConnectMessageLogic = function(data)
{
	//The host will broadcast new players to everybody and say that they should connect
	var otherPeer = data['data'];
	if(this.connectedPeers.indexOf(otherPeer) == -1)
	{
		this.connect(otherPeer);
		this.log("Host told me to create a conn with: " + otherPeer, CrunchJS.LogLevels.DEBUG);
	}
}

/**
 * Sends a JSON message to all connection objects
 * @param {Object} message JSON message object
 */
CrunchJS.Internal.NetworkManager.prototype.sendMessageToAllPeers = function(message)
{
	for (var i=0;i<this.connections.length;i++)
	{
		this.connections[i].send(message);
	}
};

/**
 * Returns JSON for a "connect" message
 * @return {Object} JSON object for a "connect" message
 */
CrunchJS.Internal.NetworkManager.prototype.createConnectMessage = function()
{
	return {'type':'connect','data':this.peerId}
};

/**
 * Returns JSON for a "should_connect" message.
 * @param {string} otherPeerId peer ID to populate the message with
 * @return {Object} JSON object for a "should_connect" message
 */
CrunchJS.Internal.NetworkManager.prototype.createShouldConnectMessage = function(otherPeerId)
{
	return {'type': 'should_connect', 'data': otherPeerId};
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
};

/**
 * Probes for a host causing this peer to become the host if it cannot find the host
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

/**
 * Helper for contains boolean check
 * @param {Array.<string>} list
 * @param {string} item Item to check for in the list
 */
CrunchJS.Internal.NetworkManager.prototype.contains = function(list, item) {
    if(list.indexOf(item) == -1)
	{
		return false;
	}
	else
	{
		return true;
	}
};

/**
 * Connect to a new peer
 * @param {string} pId A remote peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.connect = function(pId)
{
	this.log("Trying to connect to: " + pId, CrunchJS.LogLevels.DEBUG);
	var conn = this.peer.connect(pId);
	//open a connection
	conn.on('open', function(){
		this.log("Connected to: " + pId, CrunchJS.LogLevels.DEBUG);
		//Tell the peer that you want to connect with him.
		var message = this.createConnectMessage();
		conn.send(message);
		//Save the connection.
		this.connectedPeers.push(pId);
		this.connections.push(conn);
	}.bind(this));
	conn.on('close', function(){
		this.log("Disconnected from: " + pId, CrunchJS.LogLevels.DEBUG);
		var position = this.connectedPeers.indexOf(pId);
		this.connectedPeers.splice(position, 1);
		this.connections.splice(position, 1);
	}.bind(this));
	setTimeout(function()
	{
		this.log("I have connections to these peers...", CrunchJS.LogLevels.DEBUG);
		this.log(this.connectedPeers, CrunchJS.LogLevels.DEBUG);
		if(this.contains(this.connectedPeers, pId) == false)
		{
			this.log("Could not connect to: " + pId, CrunchJS.LogLevels.DEBUG);
			//if failed to connect to host
			if(pId == 'host')
			{
				//become host
				this.initialize(true);
			}
		}
	}.bind(this), 5000);
};

/**
 * Logs a message
 * @param  {Object} message The object to log
 * @param  {CrunchJS.LogLevel} level   The log level
 */
CrunchJS.Internal.NetworkManager.prototype.log = function(message, level) {
	CrunchJS.world.log(message, level);
};