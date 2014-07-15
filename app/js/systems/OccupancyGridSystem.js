/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Systems.OccupancyGridSystem');

goog.require('CrunchJS.System'); 

goog.require('goog.structs.Set');
goog.require('goog.structs');

/**
 * Creates an Occupancy Grid System 
 * @constructor
 * @class 
 */
CrunchJS.Systems.OccupancyGridSystem = function() {
	this.grids = new goog.structs.Set();

};

goog.inherits(CrunchJS.Systems.OccupancyGridSystem, CrunchJS.System);

CrunchJS.Systems.OccupancyGridSystem.prototype.name = 'OccupancyGridSystem';

CrunchJS.Systems.OccupancyGridSystem.prototype.activate = function() {
	goog.base(this, 'activate');

	this.gridComp = this.getScene().createEntityComposition().all('OccupancyGrid');	
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Body', 'Occupancy'));
};


/**
 * Update all of the entity positions in the grid
 * @param  {CrunchJS.Frame} frame The current frame
 */
CrunchJS.Systems.OccupancyGridSystem.prototype.process = function(frame) {
	goog.structs.forEach(this.grids, function(gridId) {
		var gridComp = this.getScene().getComponent(gridId, 'OccupancyGrid');

		goog.structs.forEach(this.getActiveEntities(), function(ent) {
			gridComp.updateEntity(ent);
		}, this);

	}, this);

};

CrunchJS.Systems.OccupancyGridSystem.prototype.checkEntity = function(entityId) {
	goog.base(this, 'checkEntity', entityId);

	if(this.getScene().matchesComposition(entityId, this.gridComp)){
		this.grids.add(entityId);
	}
	else{
		var success = this.grids.remove(entityId);
	}
};

CrunchJS.Systems.OccupancyGridSystem.prototype.removeEntity = function(id) {
	goog.base(this, 'removeEntity', id);

	this.grids.remove(id);
};

CrunchJS.Systems.OccupancyGridSystem.prototype.refreshData = function() {
	goog.base(this, 'refreshData');
	this.grids = this.getScene().findEntities(this.gridComp);
};