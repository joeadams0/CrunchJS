/**
 * @author Joe Adams
 */

goog.provide('CloseContact.PlayerManager');

goog.require('CrunchJS.Internal.Manager');

goog.require('goog.structs.Map');

/**
 * [PlayerManager description]
 * @param {[type]} scene [description]
 * @constructor
 * @class 
 */
CloseContact.PlayerManager = function(scene) {
	goog.base(this, scene);

	this._players = 1;

	this._playerToEntityMap = new goog.structs.Map();
};

goog.inherits(CloseContact.PlayerManager, CrunchJS.Internal.Manager);

CloseContact.PlayerManager.prototype.activate = function() {
	goog.base(this, 'activate');
};

CloseContact.PlayerManager.prototype.deactivate = function() {
	goog.base(this, 'deactivate');
};

CloseContact.PlayerManager.prototype.setEntity = function(pId, eId) {
	this._playerToEntityMap.set(pId, eId);
	if(pId>=this._players)
		this._players = pId+1;
};

CloseContact.PlayerManager.prototype.createPlayer = function() {
	var pId = this._players;
	this._players++;
	return pId;
};

CloseContact.PlayerManager.prototype.removeEntity = function(pId) {
	this._playerToEntityMap.remove(pId);
};

CloseContact.PlayerManager.prototype.getEntity = function(pId) {
	return this._playerToEntityMap.get(pId);
};

CloseContact.PlayerManager.prototype.getSnapshot = function() {
	var obj = {};

	obj._players = this._players;

	obj._playerToEntityMap = this._playerToEntityMap.toObject();

	return obj;
};

CloseContact.PlayerManager.prototype.sync = function(data) {
	this._players = data._players;

	this._playerToEntityMap = new goog.structs.Map(data._playerToEntityMap);
};