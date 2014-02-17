/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.OccupancyGrid');

goog.require('CrunchJS.Component');
goog.require('CrunchJS.Helpers.OccupancyGridHelper');
goog.require('goog.structs.Map');

/**
 * Creates an Occupancy Grid Component. Occupancy Grids are used to be able to tell what space is occupied by which entities.
 * @param {Number} width      How many tiles wide the grid should be
 * @param {Number} height     How many tiles high the grid should be
 * @param {Number} tileWidth  The width of each tile
 * @param {Number} tileHeight The height of each tile
 * @constructor
 * @class 
 */
CrunchJS.Components.OccupancyGrid = function(width, height, tileWidth, tileHeight) {

	/**
	 * The width of the grid in number of tiles
	 * @type {Number}
	 */
	this.width = width;

	/**
	 * The height of the grid in number of tiles
	 * @type {Number}
	 */
	this.height = height;

	/**
	 * The width of each tile
	 * @type {Number}
	 */
	this.tileWidth = tileWidth;

	/**
	 * The height of each tile
	 * @type {Number}
	 */
	this.tileHeight = tileHeight;

	/**
	 * The map of locations to occupancy tiles
	 * @type {Object}
	 */
	this.map = CrunchJS.Helpers.OccupancyGridHelper.createMap(width, height);

	/**
	 * Maps the entities to the rectangle of tiles they occupy in the map 
	 * @type {goog.structs.Map}
	 */
	this.entityToTilesMap = new goog.structs.Map();

};

goog.inherits(CrunchJS.Components.OccupancyGrid, CrunchJS.Component);

CrunchJS.Components.OccupancyGrid.prototype.name = 'OccupancyGrid';