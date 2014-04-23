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
	this.apiKey = 'x41mtbnpaagzxgvi';
	
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
	 
	/**
	 * Communication turn length
	 * @type {number}
	 */
	 this.communicationTurnLength = 500;
	
	/**
	 * Current communication turn number
	 * @type {number}
	 */
	 this.communicationTurn = 0;
	 
	/**
	 * Communication events hash table
	 * @type {Object.<number, Object>}
	 */
	 this.communicationEvents = {};
	 
	 /**
	  * This hash contains starting times for pings
	  * @type {Object.<string, number>}
	  */
	 this.pingStarts = {};

	 /**
	  * This list contains ping times after they are calculated
	  * @type {Array}
	  */
	 this.pingTimes = [];

	 this.player = 2;
};

goog.inherits(CrunchJS.Internal.NetworkManager, CrunchJS.Internal.Manager);

/**
 * Logs a message
 * @param  {Object} message The object to log
 * @param  {CrunchJS.LogLevel} level   The log level
 */
CrunchJS.Internal.NetworkManager.prototype.log = function(message, level) {
	CrunchJS.world.log(message, level);
};

/**
 * Logic that is executed every communication turn
 */
CrunchJS.Internal.NetworkManager.prototype.everyCommunicationTurn = function() {
	this.communicationTurn++;
	var currentEvents = this.communicationEvents[this.communicationTurn];
	if (typeof currentEvents !== 'undefined') {
		for (var i=0;i<currentEvents.length;i++)
		{ 
			this.log('Event on current communication turn: ' + this.communicationTurn);
			this.log(currentEvents[i], CrunchJS.LogLevels.DEBUG);
			//Fire event to pass data
			this.fireEventLogic(currentEvents[i]);
			delete this.communicationEvents[this.communicationTurn];
		}
		
	}
};

/**
 * Logic to fire proper event based on network command data
 * @param {Object} data The event data
 */
CrunchJS.Internal.NetworkManager.prototype.fireEventLogic = function (data) {
	CrunchJS.world.log('COMMAND: ' + data.command);
	this.getScene().fireEvent(data.command, data.data);

	if(data.command==CrunchJS.EngineCommands.Sync){
		this.getScene().onSyncRequest();
	}

	if(data.player){
		this.getScene().fireEvent('set_player', data.player);
	}
};

/**
 * Sends a network command
 * @param {Object} data The event data
 */
CrunchJS.Internal.NetworkManager.prototype.sendNetworkCommand = function(data) {
	this.sendMessageToAllPeers({type:'command', data:data});
};

/**
 * Called to activate the Network Manager
 */
CrunchJS.Internal.NetworkManager.prototype.activate = function() {
	goog.base(this, 'activate');
	this.initialize(false, true);
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
 * @param {boolean} startTurns Flag determining if communication turns should start
 */
CrunchJS.Internal.NetworkManager.prototype.initialize = function(createHost, startTurns)
{	
	//only run Network Manager in main window
	if(CrunchJS.world.isSim())
	{
		return;
	}
	var peer = null;
	if(createHost)
	{
		peer = new Peer('host', {key: this.apiKey});
	}
	else
	{
		peer = new Peer({key: this.apiKey});
	}
	//on a connection
	peer.on('open', this.peerOnOpen.bind(this));
	peer.on('connection', this.onConnectionOnData.bind(this));
	peer.on('error', this.peerOnError.bind(this));
	this.peer = peer;
	this.getScene().addEventListener(CrunchJS.Events.SendNetworkCommand, goog.bind(this.sendNetworkCommand, this));

	if(startTurns)
	{
		setTimeout(goog.bind(this.setTimeoutTurnLogic, this), this.communicationTurnLength * 3);
	}
};

/**
 * Logic for running communication turns at variable turn lengths
 */
CrunchJS.Internal.NetworkManager.prototype.setTimeoutTurnLogic = function()
{
	this.everyCommunicationTurn();
	setTimeout(goog.bind(this.setTimeoutTurnLogic, this), this.communicationTurnLength);
}

/**
 * Function for when a peer opens a connection
 * @param {string} id peer ID
 */
CrunchJS.Internal.NetworkManager.prototype.peerOnOpen = function(id) {
	//record the generated ID
	this.peerId = id;
	this.log('PeerJS ID: ' + this.peerId, CrunchJS.LogLevels.DEBUG);
	this.probeHost();
};

/**
 * Function for when a peer has an error
 * @param {Object} err An err object
 */
CrunchJS.Internal.NetworkManager.prototype.peerOnError = function(err) {
	if(err['type'] == 'unavailable-id')
	{
		//this may occur if a peer tries to become the host but a race condition prevents it
		if(this.peerId == null)
		{
			this.initialize(false, false);
		}
	}
	else if(err['message'] == 'Could not connect to peer host')
	{
		//error connecting to host
		//become host
		this.peerId = null;
		this.peer = null;
		this.connectedPeers = [];
		this.connections = [];
		this.initialize(true, false);
	}
	this.log(err, CrunchJS.LogLevels.DEBUG);
};
 
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
			//Place data in communication turn queue with delay
			var insertEvent = this.communicationTurn + 2;
			if (typeof this.communicationEvents[insertEvent] === 'undefined') {
				this.communicationEvents[insertEvent] = [];
			}
			this.communicationEvents[insertEvent].push(data['data']);
		}
		else if(data['type'] == 'ping')
		{
			var otherPeer = data['data'];
			var d = new Date();
			var n = d.getTime();
			this.pingTimes.push(n - this.pingStarts[otherPeer]);
			
			//Tell other peers to change turn length
			var turnlength = this.calculateTurnLength();
			var message = this.createTurnLengthMessage(turnlength);
			this.sendMessageToAllPeers(message);

			setTimeout(function()
			{
				this.communicationTurnLength = turnlength;
				this.log('Turn length set to: ' + turnlength, CrunchJS.LogLevels.DEBUG);
			}.bind(this), this.communicationTurnLength * 2);
			this.log('Ping RTT: ' + otherPeer,CrunchJS.LogLevels.DEBUG);
			this.log(n - this.pingStarts[otherPeer], CrunchJS.LogLevels.DEBUG);
		}
		else if(data['type'] == 'turn_length')
		{
			this.communicationTurnLength = data['data'];
			this.log('Turn length set to: ' + data['data'], CrunchJS.LogLevels.DEBUG);
		}
	}.bind(this));
};

/*
 * Helper for computing the average turn length based on ping times
 * @return {float} Average turn length
 */
CrunchJS.Internal.NetworkManager.prototype.calculateTurnLength = function()
{
	var total = 0;
	this.pingTimes.forEach(function(i)
	{
		total += i/2;
	});
	return total/this.pingTimes.length;

};

/**
 * Helper for the logic for a 'connect' message
 * @param {Object} data JSON object identified as a 'connect' message
 */
CrunchJS.Internal.NetworkManager.prototype.connectMessageLogic = function(data)
{
	var otherPeer = data['data'];
			
	//If I am the host, I should tell everybody to connect to this person
	if(this.isHost())
	{
		var message = this.createShouldConnectMessage(otherPeer);
		this.sendMessageToAllPeers(message);
	}
	
	//If somebody connected to peer then it should connect back.
	if(this.connectedPeers.indexOf(otherPeer) == -1)
	{
		this.connect(otherPeer);
		
		//If I am the host, I should measure ping to this person
		if(this.isHost())
		{
			var d = new Date();
			var n = d.getTime();
			this.pingStarts[otherPeer] = n;
		}
	}
	
	//If the host is connecting to me, ping him back
	if(this.isHost(otherPeer))
	{
		var pos = this.connectedPeers.indexOf(otherPeer);
		this.connections[pos].send(this.createPingMessage());
	}
};

/**
 * Helper for the logic for a 'should_connect' message
 * @param {Object} data JSON object identified as a 'should_connect' message
 */
CrunchJS.Internal.NetworkManager.prototype.shouldConnectMessageLogic = function(data)
{
	//The host will broadcast new players to everybody and say that they should connect
	var otherPeer = data['data'];
	if(this.connectedPeers.indexOf(otherPeer) == -1)
	{
		this.connect(otherPeer);
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
 * Returns JSON for a 'connect' message
 * @return {Object} JSON object for a 'connect' message
 */
CrunchJS.Internal.NetworkManager.prototype.createConnectMessage = function()
{
	return {'type':'connect','data':this.peerId}
};

/**
 * Returns JSON for a 'should_connect' message.
 * @param {string} otherPeerId peer ID to populate the message with
 * @return {Object} JSON object for a 'should_connect' message
 */
CrunchJS.Internal.NetworkManager.prototype.createShouldConnectMessage = function(otherPeerId)
{
	return {'type': 'should_connect', 'data': otherPeerId};
};

/**
 * Returns JSON for a 'ping' message meant for the host.
 * @return {Object} JSON object for a 'ping' message
 */
CrunchJS.Internal.NetworkManager.prototype.createPingMessage = function()
{
	return {'type': 'ping', 'data': this.peerId};
};

/**
 * Returns JSON for a 'turn_length' message
 * @return {Object} JSON object for a 'turn_length' message
 */
CrunchJS.Internal.NetworkManager.prototype.createTurnLengthMessage = function (length)
{
	return {'type': 'turn_length', 'data': length};
};
 
/**
 * Checks the peer ID to see if this is the host
 * @param {string|undefined} Optional parameter for checking a peer ID of a different peer
 * @return {boolean} Whether this is the host or not
 */
CrunchJS.Internal.NetworkManager.prototype.isHost = function(h)
{
	if(typeof(h) === 'undefined')
	{
		h = this.peerId;
	}
	
	if(h == 'host')
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
	var conn = this.peer.connect(pId);
	//open a connection
	conn.on('open', function(){
		//Tell the peer that you want to connect with him.
		var message = this.createConnectMessage();
		conn.send(message);
		if(this.peerId == 'host'){
			var player = this.player;
			this.getScene().fireEvent('create_user', player);
			conn.send({
				type : 'command',
				data : {
					command : CrunchJS.EngineCommands.Sync,
					data : this.getScene().getSnapshot(),
					player : player
				}
			});
			this.player++;

			var mssg = {
				type : 'command',
				data : {
					command : 'create_user',
					data : player
				}
			}

			this.sendMessageToAllPeers(mssg);
			conn.player = player;
		}

		//Save the connection.
		this.connectedPeers.push(pId);
		this.connections.push(conn);
		this.log('PeerJS Connections: ', CrunchJS.LogLevels.DEBUG);
		this.log(this.connectedPeers, CrunchJS.LogLevels.DEBUG);
	}.bind(this));
	conn.on('close', function(){
		var position = this.connectedPeers.indexOf(pId);
		this.connectedPeers.splice(position, 1);
		this.connections.splice(position, 1);
		this.log('PeerJS Connections: ', CrunchJS.LogLevels.DEBUG);
		this.log(this.connectedPeers, CrunchJS.LogLevels.DEBUG);

		this.getScene().fireEvent('destroy_user', conn.player);
		var mssg = {
			type : 'command',
			data : {
				command : 'destroy_user',
				data : conn.player
			}
		}

		this.sendMessageToAllPeers(mssg);

	}.bind(this));
};