/**
 * @author Justin White
 * The formula for accessing methods and properties from box2d were adapted from
 * http://www.jeremyhubble.com/box2d.html
 * The method calls to box2d.js used in PhysicsSystem.js do not exactly match up to 
 * the methods outlined in the above url since the box2d versions used differ between the url
 * and this project.
 */

goog.provide('CrunchJS.Systems.PhysicsSystem');
goog.require('CrunchJS.System'); 
goog.require('box2d.World');
goog.require('CrunchJS.System');
goog.require('box2d.World');
goog.require('box2d.AABB');
goog.require('box2d.Vec2');
goog.require('box2d.PolyShape');
goog.require('box2d.CircleDef');
goog.require('box2d.BodyDef');
goog.require('box2d.Shape');

//Provides method for finding x coorid of body in World
/**
 * Creates the Physics System
 * @extends {CrunchJS.System}
 * @constructor
 * @class Physics System
 */
CrunchJS.Systems.PhysicsSystem = function() {
	this.phys = new goog.structs.Set();
};

goog.inherits(CrunchJS.Systems.PhysicsSystem, CrunchJS.System);

CrunchJS.Systems.PhysicsSystem.prototype.name = 'PhysicsSystem';

CrunchJS.Systems.PhysicsSystem.prototype.activate = function() {
	goog.base(this, 'activate');
	this.physComp = this.getScene().createEntityComposition().all('PhysicsComponent');	
	this.setEntityComposition(this.getScene().createEntityComposition().one('Transform', 'Body', 'Physics'));//.exclude('ExampleComp')
	this.box2dWorld = this.init();
};

CrunchJS.Systems.PhysicsSystem.prototype.process = function(frame) {
	goog.structs.forEach(this.phys, function(physId) {
		var physComp = this.getScene().getComponent(this.physID, 'PhysicsComponent');

		goog.structs.forEach(this.getActiveEntities(), function(ent) {
				
		//if physics component has a corresponding body in box2d
		if (this.checkEntExistsInPhys(ent, this.box2dWorld) == true){
			//update box2d objects to match component's values
			physComp.updateBox2dBody(ent, this.box2dWorld);
		}
		else{
			//else create a body in box2d to match new physics component
			if (ent.getRadius == 0)
				this.addRectangle(ent, this.box2dWorld);
			if (ent.getRadius > 0)
				this.addCircle(ent, this.box2dWorld)
		}
		}, this);

	}, this);

	//step physics world
	this.update(this.box2dWorld);

	//update physics component with updated values from box2d
	goog.structs.forEach(this.phys, function(physId) {
		var physComp = this.getScene().getComponent(this.physID, 'PhysicsComponent');
		goog.structs.forEach(this.getActiveEntities(), function(ent) {
	
		//if physics component has different value then corresponding box2d body
		//update physics component to match box2d's values
		var updatePhys = physComp.updatePhysComponent(ent, this.box2dWorld);
		if (updatePhys == false){
			CrunchJS.world.log('error in calling updatePhysComponent() on ', CrunchJS.LogLevels.DEBUG);
			CrunchJS.world.log(ent, CrunchJS.LogLevels.DEBUG);
		}
		}, this);

	}, this);
}

//helper method for process function
//updates box2d objects to match component's values
CrunchJS.Systems.PhysicsSystem.prototype.updateBox2dBody = function(ent, world) {
	var node = world.GetBodyList();
	while (node){
		var b = node;
		node = node.GetNext();
		var shape = b.GetShapeList();
		while (shape){ 
			var shape1 = shape;
			shape = shape.GetNext();
			if (shape1 != null){
				//This sets the component's x-coorid and y-coorid to be equal to the values in box2d'w world
				if (b.GetUserData() === ent.getObjectId){
					shape1.setPositionX(ent.getPositionX());
					shape1.setPositionY(ent.getPositionY());
					return true;
				}
			}
		}
	}
	return false;
};

//helper method for process function
//update physics component with updated values from box2d
CrunchJS.Systems.PhysicsSystem.prototype.updatePhysComponent = function(ent, world) {
	var node = world.GetBodyList();
	while (node){
		var b = node;
		node = node.GetNext();
		var shape = b.GetShapeList();
		while (shape){ 
			var shape1 = shape;
			shape = shape.GetNext();
			if (shape1 != null){
				//This sets the component's x-coorid and y-coorid to be equal to the values in box2d'w world
				if (b.GetUserData() === ent.getObjectId){
					ent.setPositionX(shape1.GetPosition().x);
					ent.setPositionY(shape1.GetPosition().y);
					return true;
				}
			}
		}
	}
	return false;
};
//helper method
//finds if component has a corresponding body in the physics world
CrunchJS.Systems.PhysicsSystem.prototype.checkEntExistsInPhys = function(ent, world){
	var returnBool = false;
	var node = world.GetBodyList();
	while (node){
		var b = node;
		node = node.GetNext();
		if (b.GetUserData() === ent.objectId){
			returnBool = true;
		}
	}
	return returnBool;
};

/**
 * Initializes world and objects.
 */
CrunchJS.Systems.PhysicsSystem.prototype.init = function (){
	
	var worldAABB = new box2d.AABB();
	worldAABB.minVertex.Set(-1000, -1000);
	worldAABB.maxVertex.Set(1000, 1000);
	var gravity = new box2d.Vec2(0, 0);
	var doSleep = true;
	var world = new box2d.World(worldAABB, gravity, doSleep);
	this.addCircle(5, world);	
	return world;
};



 /**
 * Helper method to get collisions that have happened during that step
 */
//b is linked list of bodies in world
CrunchJS.Systems.PhysicsSystem.prototype.collisionCollect = function (b){
	var edge = b.GetContactList();
	return edge;
	//can iterate over edges to evaluate the collisions that happened
};


/**
 * main function
 * called at the regular interval as defined in init()
 * edits the transform component once an object moves after a step()
 */
CrunchJS.Systems.PhysicsSystem.prototype.update = function (world){
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
};

/**
 * Adds rectangle to Box2D simulation
 * Sets width, height, mass, and placement of object
 * Creates object in Box2D world
 * @param {int} ent entity number
 * @param {world} world Box2D world
 */
 CrunchJS.Systems.PhysicsSystem.prototype.addRectangle = function (ent, world){
	var boxSd = new box2d.BoxDef();
	boxSd.density = 1.0;

	boxSd.extents.Set(ent.getRecWidth(), ent.getRecHeight());
	var boxBd = new box2d.BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(ent.getPositionX(),ent.getPositionY());
	boxBd.userData = ent.getObjectId();

	//Add new physics component representing this rectangle in box2d world
	world.CreateBody(boxBd)
 };

/**
 * Adds circle to Box2D simulation
 * @param {int} ent   entity number
 * @param {world} world Box2D world
 */
CrunchJS.Systems.PhysicsSystem.prototype.addCircle = function (ent, world){
	var circleSd = new box2d.CircleDef();
	circleSd.density = 1.0;
	circleSd.radius = ent.getRadius();
	circleSd.restitution = 1.0;
	circleSd.friction = 1.0;
	var circleBd = new box2d.BodyDef();
	circleBd.AddShape(circleSd);
	circleBd.position.Set(ent.getPositionX(), ent.getPositionY());
	circleBd.userData = ent.getObjectId();
	
	//Add new physics component representing this circle in box2d world
	var circleBody = world.CreateBody(circleBd);

	

};

/**
 * Adds force to objectID over time
 * @param  {String} objectID id of object
 * @param  {int} degree    angle of force to be applied
 * @param  {int} power     magnitude of the force
 */
CrunchJS.Systems.PhysicsSystem.prototype.addForce = function (objectID, degree, power){
	var body = this.bodiesMap[objectID];
	body.ApplyForce(new box2d.Vec2(Math.cos(degree * (Math.PI / 180)) * power,
        Math.sin(degree * (Math.PI / 180)) * power),
        body.GetWorldCenter());
};

/**
 * Adds force to objectID within in physics simulation
 *
 * ApplyImpulse method signiture from Box2D file
 * box2d.Body.prototype.ApplyImpulse = function(impulse, point)
 * 
 * @param {int} objectID Entity
 * @param {vector} v is a vector composed of x and y components representing velocity in each direction
 */
CrunchJS.Systems.PhysicsSystem.prototype.addImpulse = function (objectID, degree, power){
	var body = this.bodiesMap[objectID];
    body.ApplyImpulse(new box2d.Vec2(Math.cos(degree * (Math.PI / 180)) * power,
        Math.sin(degree * (Math.PI / 180)) * power),
        body.GetWorldCenter());
};

/**
 * Stops the execution of the setInterval
 * @param  {int} intervalVariable global variable set by initial setInterval() call
 */
CrunchJS.Systems.PhysicsSystem.prototype.cancelUpdate = function (intervalVariable){
	clearInterval(intervalVariable);
};