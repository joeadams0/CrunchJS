/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.TileMapHelper');

/**
 * Creates a Tile Map Helper. This helper transforms the tile map data functionally to keep the logic and the data seperated.
 * @constructor
 * @class 
 */
CrunchJS.TileMapHelper = function() {

};

/**
 * Creates a map data representation
 * @param  {number} mapWidth  The number of tiles wide the map is
 * @param  {number} mapHeight The number of tiles high the map is
 * @return {Object}           The map
 */
CrunchJS.TileMapHelper.prototype.createMap = function(mapWidth,mapHeight) {
	var map;

	return map;
};

/**
 * Checks if the tile is occupied
 * @param {CrunchJS.TileMapComponent} comp The tile map component
 * @param  {(goog.math.Rect|number)}  rect The Rectangle to check, or x index of the tile
 * @param  {number=}  y The y index of the tile
 * @param {number=} width The number of tiles to check in the x direction. Defaults to 1
 * @param {number=} height The number of tiles to check in the y direction. Defaults to 1
 * @return {Boolean}   True if it is occupied
 */
CrunchJS.TileMapHelper.prototype.isOccupied = function(comp,rect,y,width,height) {
	var isOccupied = false;;

	return isOccupied;
};

/**
 * Gets the id that occupies the tile
 * @param {CrunchJS.TileMapComponent} comp The tile map component
 * @param  {number} x The x index of the tile
 * @param  {number} y The y index of the tile
 * @return {number}   The entity id
 */
CrunchJS.TileMapHelper.prototype.getOccupierId = function(comp,x,y) {
	var id = 0;

	return id;
};

/**
 * Sets the tile to be occupied by the id of the entity that contains the component
 * @param {CrunchJS.TileMapComponent} tileMapComp The tile map component
 * @param {CrunchJS.BodyComponent} comp The body component
 */
CrunchJS.TileMapHelper.prototype.setOccupied = function(tileMapComp,comp) {

};

/**
 * Sets the tile to be unoccupied
 * @param {CrunchJS.TileMapComponent} comp The tile map component
 * @param {number} x The x index of the tile
 * @param {number} y The y index of the tile
 */
CrunchJS.TileMapHelper.prototype.setUnoccupied = function(comp, x,y) {

};

/**
 * Sets all tiles occupied by the given id to be unoccupied
 * @param {CrunchJS.TileMapComponent} comp The tile map component
 * @param {number} id The id of the occupier
 */
CrunchJS.TileMapHelper.prototype.setAllUnoccupied = function(comp, id) {
	
};

/**
 * Gets the tile range that is occupied by the body component
 * @param  {CrunchJS.TileMapComponent} tileMapComp The tile map to operate on
 * @param  {CrunchJS.BodyComponent} bodyComp    The body component to use
 * @return {goog.math.Rect}         The range
 */
CrunchJS.TileMapHelper.prototype.getTileRange = function(tileMapComp,bodyComp) {
	
};