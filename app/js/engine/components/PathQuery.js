/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Components.PathQuery');

goog.require('CrunchJS.Component');


/**
 * Creates a Path Query Component. The Path Query represents a query to find the shortest path between two coordinates in an occupancy grid.
 * This component will be consumed and replaced with a Path Component once the query has been completed.
 * @param {Object} params.start The start coordinate of the path. Should have an x and a y value.
 * @param {Object} params.end The end coordinate of the path. Should have an x and a y value.
 * @param {Number} params.gridId The id of the entity with the occupancy grid on which to find the path
 * @class 
 * @constructor
 */
CrunchJS.Components.PathQuery = function(params) {
	goog.base(this, params);
	
	this.start = params.start;
	this.end = params.end;

	this.gridId = params.gridId;

	this.updates = {};
};

goog.inherits(CrunchJS.Components.PathQuery, CrunchJS.Component);

CrunchJS.Components.PathQuery.prototype.name = 'PathQuery';


/**
 * Gets the start coord
 * @return {Object} The start Coordinate
 */
CrunchJS.Components.PathQuery.prototype.getStart = function() {
	return this.start;
};

/**
 * Gets the end coord
 * @return {Object} The end coord
 */
CrunchJS.Components.PathQuery.prototype.getEnd = function() {
	return this.end;
};

/**
 * Gets the id of the entity with the occupancy grid
 * @return {Number} The id
 */
CrunchJS.Components.PathQuery.prototype.getGridId = function() {
	return this.gridId;
};

/**
 * Sets the start coordinate
 * @param {Object} start The start coord
 */
CrunchJS.Components.PathQuery.prototype.setStart = function(start) {
	this.start = start;

	this.updates.start = true;
	
	this.hasBeenUpdated();
};

/**
 * Sets the end coordinate
 * @param {Object} end The end coord
 */
CrunchJS.Components.PathQuery.prototype.setEnd = function(end) {
	this.end = end;

	this.updates.end = true;

	this.hasBeenUpdated();
};

/**
 * Updates the grid Id
 * @param {Number} id The id of the entity with the occupancy grid
 */
CrunchJS.Components.PathQuery.prototype.setGridId = function(id) {
	this.gridId = id;

	this.updates.gridId = true;

	this.hasBeenUpdated();
};

CrunchJS.Components.PathQuery.prototype.getUpdates = function() {
	var obj = {};

	if(this.updates.start)
		obj.start = this.start;
	if(this.updates.end)
		obj.end = this.end;
	if(this.updates.gridId)
		obj.gridId = this.gridId;

	return obj;
};

CrunchJS.Components.PathQuery.prototype.update = function(obj) {
	if(obj.start)
		this.start = obj.start;
	if(obj.end)
		this.end = obj.end;
	if(obj.gridId)
		this.gridId = obj.gridId;
};
