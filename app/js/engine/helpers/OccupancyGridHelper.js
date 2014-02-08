/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Helpers.OccupancyGridHelper');

goog.require('CrunchJS.Utils.BitSetOperator');
goog.require('goog.array');

/**
 * A singleton class to perform operations on the OccupancyGrid component.
 * @class 
 * @constructor
 */
CrunchJS.Helpers.OccupancyGridHelper = function() {
	// What each flag index represents
	this.flagIndecies = {
		walkable : 1,
		flyable : 2
	};

	this.bitOp = CrunchJS.Utils.BitSetOperator.getInstance();
};

goog.addSingletonGetter(CrunchJS.Helpers.OccupancyGridHelper);

/**
 * Creates a map data representation
 * @param  {number} mapWidth  The number of tiles wide the map is
 * @param  {number} mapHeight The number of tiles high the map is
 * @return {Object}           The map
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.createMap = function(mapWidth,mapHeight) {
	var map = [];

	for(var x = 0; x < mapWidth; x++){
		map[x] = [];
		
		for(var y = 0; y < mapHeight; y++){
			map[x][y] = this.bitOp.createBitSet();
		}
	}

	return map;
};

/**
 * Checks if the tile is occupied
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param  {(goog.math.Rect|number)}  rect The Rectangle to check, or x index of the tile
 * @param  {number=}  y The y index of the tile
 * @param {number=} width The number of tiles to check in the x direction. Defaults to 1
 * @param {number=} height The number of tiles to check in the y direction. Defaults to 1
 * @return {Boolean}   True if it is occupied
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.isOccupied = function(comp,rect,y,width,height) {
	var isOccupied = false;;

	return isOccupied;
};

/**
 * Gets the id that occupies the tile
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param  {number} x The x index of the tile
 * @param  {number} y The y index of the tile
 * @return {number}   The entity id
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getOccupierId = function(comp,x,y) {
	var id = 0;

	return id;
};

/**
 * Sets the tile to be occupied by the id of the entity that contains the component
 * @param {CrunchJS.Components.OccupancyGrid} tileMapComp The tile map component
 * @param {CrunchJS.Compenents.Body} comp The body component
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setOccupied = function(tileMapComp,comp) {

};

/**
 * Sets the tile to be unoccupied
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} x The x index of the tile
 * @param {number} y The y index of the tile
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setUnoccupied = function(comp, x,y) {

};

/**
 * Sets all tiles occupied by the given id to be unoccupied
 * @param {CrunchJS.Components.OccupancyGrid} comp The tile map component
 * @param {number} id The id of the occupier
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.setAllUnoccupied = function(comp, id) {
	
};

/**
 * Gets the tile range that is occupied by the body component
 * @param  {CrunchJS.Components.OccupancyGrid} tileMapComp The tile map to operate on
 * @param  {CrunchJS.Compenents.Body} bodyComp    The body component to use
 * @return {goog.math.Rect}         The range
 */
CrunchJS.Helpers.OccupancyGridHelper.prototype.getTileRange = function(tileMapComp,bodyComp) {
	
};