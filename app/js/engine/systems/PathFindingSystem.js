/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.PathFindingSystem');

goog.require('CrunchJS.System');

/**
 * Creates a Path Finding System. This system assumes that the object with the masterName name has the TileMapComponent.
 * @param {string} masterName The name of the entity with the TileMapComponent
 * @constructor
 * @class 
 */
CrunchJS.PathFindingSystem = function(masterName) {
	/**
	 * The name of the master object
	 * @type {string}
	 */
	this.masterName = masterName;
};

goog.inherits(CrunchJS.PathFindingSystem, CrunchJS.System);

CrunchJS.PathFindingSystem.name = 'PathFindingSystem';