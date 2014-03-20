/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Systems.PathMovementSystem');

goog.require('CrunchJS.System');

goog.require('goog.structs.Set');
goog.require('goog.array');
goog.require('goog.math');

/**
 * Creates a Path Movement System. This system moves entities along paths defined by Path Components.
 * @constructor
 * @class [description]
 */
CrunchJS.Systems.PathMovementSystem = function() {

};

goog.inherits(CrunchJS.Systems.PathMovementSystem, CrunchJS.System);

CrunchJS.Systems.PathMovementSystem.prototype.name = 'CrunchJS.Systems.PathMovementSystem';

CrunchJS.Systems.PathMovementSystem.prototype.activate = function() {
	goog.base(this, 'activate');

	this.setEntityComposition(this.getScene().createEntityComposition().all('Path'));
};

CrunchJS.Systems.PathMovementSystem.prototype.processEntity = function(frame, ent) {
	if(frame.id % 30 == 0){
		var path = this.getScene().getComponent(ent, 'Path'),
			transform = this.getScene().getComponent(ent, 'Transform');

		var step = path.getSteps()[path.getStep()];

		transform.setX(step.x);
		transform.setY(step.y);

		if(path.step == path.steps.length-1){
			this.getScene().removeComponent(ent, 'Path');
		}
		else{
			path.setStep(path.getStep() + 1);
		}
	}
};
