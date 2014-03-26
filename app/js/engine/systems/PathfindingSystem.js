/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Systems.PathfindingSystem');

goog.require('CrunchJS.System');
goog.require('CrunchJS.Components.Path');

goog.require('goog.structs');
goog.require('goog.array');
goog.require('goog.math');

/**
 * Creates a new Pathfinding System
 * @constructor
 * @class 
 */
CrunchJS.Systems.PathfindingSystem = function() {

};

goog.inherits(CrunchJS.Systems.PathfindingSystem, CrunchJS.System);

CrunchJS.Systems.PathfindingSystem.prototype.name = 'CrunchJS.Systems.PathfindingSystem';


/**
 * Called when the systme is activated. Sets the entity composition
 */
CrunchJS.Systems.PathfindingSystem.prototype.activate = function() {
	goog.base(this, 'activate');

	this.setEntityComposition(this.getScene().createEntityComposition().all('PathQuery'));
};

CrunchJS.Systems.PathfindingSystem.prototype.processEntity = function(frame, ent) {
	var query = this.getScene().getComponent(ent, 'PathQuery'),
		transform = this.getScene().getComponent(ent, 'Transform'),
		occGrid = this.getScene().getComponent(query.gridId, 'OccupancyGrid'),
		steps;

	this.getScene().removeComponent(ent, 'PathQuery');

	steps = this.astar(occGrid, query.start, query.end, false);
	CrunchJS.world.log(steps);

	this.getScene().addComponent(ent, new CrunchJS.Components.Path({
		steps : steps,
		step : 0
	}));
};


CrunchJS.Systems.PathfindingSystem.prototype.astar = function(occGrid, start, end, diagEnabled) {
	var openList = [], 
		closedList = new goog.structs.Set(),
		startTile = occGrid.coordToTile(start.x, start.y),
		endTile = occGrid.findNearestUnoccupiedTile({
			x : end.x,
			y : end.y
		}),
		currentNode, neighbors, steps, success = false;

	CrunchJS.world.log(endTile);

	openList.push(this.createSearchNode(startTile,0,endTile));

	while(openList.length != 0){

		// Expand this node
		currentNode = openList.pop();

		// we are done here
		if(currentNode.x == endTile.x && currentNode.y == endTile.y){
			success = true;
			break;
		}

		closedList.add(currentNode);

		neighbors = occGrid.getNeighbors({
			x : currentNode.x,
			y : currentNode.y,
			diag : diagEnabled
		});

		goog.structs.forEach(neighbors, function(neighbor) {
			var notOccupied = !occGrid.isOccupied({
					x : neighbor.x,
					y : neighbor.y
				}),
				notClosed = goog.structs.every(closedList, function(node) {
					return neighbor.x != node.x || neighbor.y != node.y;
				});

			// If neighbor is not occupied and not already exanded
			if(notOccupied && notClosed){
				// Create the node
				var neighborNode = this.createSearchNode(neighbor, currentNode.distFromStart+1, endTile);

				neighborNode.parent = currentNode;

				var node = goog.array.find(openList, function(node) {
					return node.x == neighborNode.x && node.y == neighborNode.y;
				});

				// If neighbor is on openlist, but needs updated
				if(node && node.distFromStart > neighborNode.distFromStart){
					node.distFromStart = neighborNode.distFromStart;
					node.parent = neighborNode.parent;
					node.heuristic = neighborNode.heuristic;
				}
				// Put it on the openlist
				else
					openList.push(neighborNode);

			}
		}, this);

		goog.array.stableSort(openList, function(o1, o2) {
			return o2.heuristic-o1.heuristic;
		});
	}

	steps = this.reconstructPath(currentNode, occGrid);

	// Make sure it goes to exact coord instead of center of tile
	// if(success){
	// 	steps[steps.length-1].x = end.x;
	// 	steps[steps.length-1].y = end.y;
	// }

	return steps;
};

CrunchJS.Systems.PathfindingSystem.prototype.createSearchNode = function(tile, distFromStart, goalTile) {
	var node = {}, distToGoal;

	node.x = tile.x;
	node.y = tile.y;

	distToGoal = goog.math.safeFloor(Math.sqrt(Math.pow(Math.abs(goalTile.x - node.x),2) + Math.pow(Math.abs(goalTile.y - node.y), 2)));

	node.heuristic = distFromStart + distToGoal;

	node.distFromStart = distFromStart;

	return node;
};

CrunchJS.Systems.PathfindingSystem.prototype.reconstructPath = function(node, occGrid) {
	var steps = [], step;

	while(node){
		step = occGrid.tileToCoord(node.x, node.y);

		steps.push(step);

		node = node.parent;
	}

	return steps.reverse();
};

