/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.ProjectileSystem');

goog.require('CrunchJS.System');
goog.require('goog.math');


CloseContact.Systems.ProjectileSystem = function() {};

goog.inherits(CloseContact.Systems.ProjectileSystem, CrunchJS.System);

CloseContact.Systems.ProjectileSystem.prototype.name = 'ProjectileSystem';

CloseContact.Systems.ProjectileSystem.prototype.activate = function() {
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Projectile', 'Physics'));
};

CloseContact.Systems.ProjectileSystem.prototype.processEntity = function(frame, entityId) {
	var trans = this.getScene().getComponent(entityId, 'Transform'),
		projectile = this.getScene().getComponent(entityId, 'Projectile'),
		phys = this.getScene().getComponent(entityId, 'Physics'),
		targetTrans = this.getScene().getComponent(projectile.getId(), 'Transform');

	if(!targetTrans){
		this.getScene().destroyEntity(entityId);
		return;
	}

	if(goog.math.nearlyEquals(trans.getX(), targetTrans.getX(), 4) && goog.math.nearlyEquals(trans.getY(), targetTrans.getY(), 4)){
		var actor = this.getScene().getComponent(projectile.getId(), 'Actor');

		actor.takeAttackDmg(projectile.getDmg());

		if(actor.getHealth()<=0){
			this.getScene().destroyEntity(projectile.getId());
		}

		this.getScene().destroyEntity(entityId);

		return;
	}

	var velocity = {
			x : targetTrans.getX() - trans.getX(),
			y : targetTrans.getY() - trans.getY()
		},
		mag = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)),
		ratio = projectile.getSpeed()/mag;

	velocity.x *= ratio;
	velocity.y *= ratio;

	phys.setVelocityX(velocity.x);
	phys.setVelocityY(velocity.y);

};