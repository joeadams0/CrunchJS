/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.PhysicsPathMovementSystem');

goog.require('CrunchJS.System');

goog.require('goog.structs.Set');
goog.require('goog.array');
goog.require('goog.math');

/**
 * Creates a Path Movement System. This system moves entities along paths defined by Path Components.
 * @constructor
 * @class [description]
 */
CloseContact.Systems.PhysicsPathMovementSystem = function() {

};

goog.inherits(CloseContact.Systems.PhysicsPathMovementSystem, CrunchJS.System);

CloseContact.Systems.PhysicsPathMovementSystem.prototype.name = 'CloseContact.Systems.PhysicsPathMovementSystem';

CloseContact.Systems.PhysicsPathMovementSystem.prototype.activate = function() {
	goog.base(this, 'activate');

	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform','Path', 'Physics', 'Actor'));
};

CloseContact.Systems.PhysicsPathMovementSystem.prototype.processEntity = function(frame, ent) {
	var path = this.getScene().getComponent(ent, 'Path'),
		transform = this.getScene().getComponent(ent, 'Transform'),
		physics = this.getScene().getComponent(ent, 'Physics'),
		actor = this.getScene().getComponent(ent, 'Actor');

	var currentStep = path.getSteps()[path.getStep()];

	if(!currentStep)
		return;
	
	// If we are at the end of a step
	if(goog.math.nearlyEquals(currentStep.x, transform.getX(), .5) && goog.math.nearlyEquals(currentStep.y, transform.getY(), .5)){
		// Last step
		if(path.step == path.steps.length-1){
			this.getScene().removeComponent(ent, 'Path');
			physics.setVelocityX(0);
			physics.setVelocityY(0);
			return;
		}
		else{
			path.setStep(path.getStep() + 1);
			currentStep = path.getSteps()[path.getStep()];
		}
	}
	

	// Set the velocity
	var velocity = {
			x : currentStep.x - transform.getX(),
			y : currentStep.y - transform.getY()
		},
		speed = actor.getMovementSpeed(),
		mag = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)),
		ratio = speed/mag;

	velocity.x *= ratio;
	velocity.y *= ratio;

	physics.setVelocityX(velocity.x);
	physics.setVelocityY(velocity.y);

};
