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
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Body', 'Physics'));//.exclude('ExampleComp')
	this.box2dWorld = this.init();
};

CrunchJS.Systems.PhysicsSystem.prototype.process = function(frame) {
	goog.structs.forEach(this.getActiveEntities(), function(ent) {
		
		var phys = this.getScene().getComponent(ent, 'Physics');

		//if physics component has a corresponding body in box2d
		if (this.checkEntExistsInPhys(phys, this.box2dWorld) == true){
			//update box2d objects to match component's values
			this.updateBox2dBody(phys, this.box2dWorld);
		}
		else{
			//else create a body in box2d to match new physics component
			if (phys.getRadius() == 0)
				this.addRectangle(phys, this.box2dWorld);
			if (phys.getRadius() > 0)
				this.addCircle(phys, this.box2dWorld)
		}
	}, this);


	//step physics world
	this.update(this.box2dWorld);

	goog.structs.forEach(this.getActiveEntities(), function(ent) {

		//if physics component has different value then corresponding box2d body
		//update physics component to match box2d's values
		var phys = this.getScene().getComponent(ent, 'Physics'),
			updatePhys = this.updatePhysComponent(phys, this.box2dWorld);

		if (updatePhys == false){
			CrunchJS.world.log('error in calling updatePhysComponent() on ', CrunchJS.LogLevels.DEBUG);
			CrunchJS.world.log(ent, CrunchJS.LogLevels.DEBUG);
		}
	}, this);
}

//helper method for process function
//updates box2d objects to match component's values
CrunchJS.Systems.PhysicsSystem.prototype.updateBox2dBody = function(phys, world) {
	var node = world.GetBodyList(),
		trans = this.getScene().getComponent(phys.entityId, 'Transform');;
	while (node){
		if(node.GetUserData() === phys.objectId){
			node.m_position.Set(trans.getX(),trans.getY());
			node.SetLinearVelocity(new box2d.Vec2(phys.getVelocityX(), phys.getVelocityY()));
			return true;
		}
		node = node.GetNext();
	}
	return false;
};

//helper method for process function
//update physics component with updated values from box2d
CrunchJS.Systems.PhysicsSystem.prototype.updatePhysComponent = function(phys, world) {
	var node = world.m_bodyList,
		trans = this.getScene().getComponent(phys.entityId, 'Transform');
	while (node){
		if(node.GetUserData() === phys.objectId){
			trans.setX(node.m_position.x);
			trans.setY(node.m_position.y);
			phys.setVelocityX(node.m_linearVelocity.x);
			phys.setVelocityY(node.m_linearVelocity.y);
			return true;
		}
		node = node.GetNext();
	}
	return false;
};

CrunchJS.Systems.PhysicsSystem.prototype.checkEntExistsInPhys = function(phys, world){
	var returnBool = false;
	var node = world.GetBodyList();
	while (node){
		var b = node;
		node = node.GetNext();
		if (b.GetUserData() === phys.objectId){
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
	this.box2dWorld.Step(timeStep, iteration);
};
//TO DO: Have to adjust how vertexes are added to Box2D world
/**
 * Adds rectangle to Box2D simulation
 * Sets width, height, mass, and placement of object
 * Creates object in Box2D world
 * @param {int} canvaswidth
 * @param {int} canvasheight
 */
 CrunchJS.Systems.PhysicsSystem.prototype.addRectangle = function (phys, world){
 	var trans = this.getScene().getComponent(phys.entityId, 'Transform');

 	//create rectangle

	var boxSd = new box2d.BoxDef();
	boxSd.density = 1.0;
	boxSd.categoryBits = trans.getLayer();
	boxSd.maskBits = 0;

	//boxSd.userData = id;

	boxSd.extents.Set(phys.getRecWidth(), phys.getRecHeight());
	var boxBd = new box2d.BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(trans.getX(),trans.getY());
	boxBd.rotation = phys.getRotation();
	boxBd.linearVelocity = new box2d.Vec2(phys.getVelocityX(), phys.getVelocityY());
	boxBd.preventRotation = phys.getPreventRotation();
	boxBd.userData = phys.getObjectId();
	boxBd.allowSleep = false;


	//Add new physics component representing this rectangle in box2d world
	world.CreateBody(boxBd)
 };


CrunchJS.Systems.PhysicsSystem.prototype.addCircle = function (phys, world){
 	var trans = this.getScene().getComponent(phys.entityId, 'Transform');

	var circleSd = new box2d.CircleDef();
	circleSd.density = 1.0;
	circleSd.radius = phys.getRadius();
	circleSd.restitution = 1.0;
	circleSd.friction = 1.0;
	var circleBd = new box2d.BodyDef();
	circleBd.AddShape(circleSd);
	circleBd.position.Set(trans.getX(), trans.getY());
	circleBd.userData = phys.getObjectId();
	
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