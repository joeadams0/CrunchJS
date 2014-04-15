/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.AttackSystem');

goog.require('CrunchJS.System');
goog.require('CrunchJS.Components.PathQuery');
goog.require('CrunchJS.Components.Transform');
goog.require('CrunchJS.Components.RenderImage');
goog.require('CrunchJS.Components.Physics');
goog.require('CrunchJS.Components.Body');
goog.require('CloseContact.Components.Projectile');

goog.require('goog.math');

CloseContact.Systems.AttackSystem = function() {

};

goog.inherits(CloseContact.Systems.AttackSystem, CrunchJS.System);

CloseContact.Systems.AttackSystem.prototype.name = 'AttackSystem';

CloseContact.Systems.AttackSystem.prototype.activate = function() {

	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Actor', 'Attack'));
};

CloseContact.Systems.AttackSystem.prototype.processEntity = function(frame, entity) {
	var attack  = this.getScene().getComponent(entity, 'Attack'),
		attackerActor = this.getScene().getComponent(entity, 'Actor'),
		attackerTrans = this.getScene().getComponent(entity, 'Transform'),
		currentTime = Date.now();

	// See if we can attack
	if(attackerActor.getNextAttackTime() <= currentTime){
		var enemyTrans = this.getScene().getComponent(attack.getEntity(), 'Transform'),
			enemyActor = this.getScene().getComponent(attack.getEntity(), 'Actor'),
			path = this.getScene().getComponent(entity, 'Path');

		if(!enemyTrans){
			this.getScene().removeComponent(entity, 'Attack');
			
			var phys = this.getScene().getComponent(entity, 'Physics');
			this.getScene().removeComponent(entity, 'Path');
			this.getScene().removeComponent(entity, 'PathQuery');

			if(phys){
				phys.setVelocityX(0);
				phys.setVelocityY(0);
			}

			return;
		}

		// Check if still in distance
		if(attackerTrans.distance(enemyTrans) <= attackerActor.getAttackRange()){
			var pathQuery = this.getScene().getComponent(entity, 'PathQuery');
			// Attacking cancels move
			if(path || pathQuery){
				var phys = this.getScene().getComponent(entity, 'Physics');
				this.getScene().removeComponent(entity, 'Path');
				this.getScene().removeComponent(entity, 'PathQuery');

				if(phys){
					phys.setVelocityX(0);
					phys.setVelocityY(0);
				}
			}


			// Fire projectile
			var projectile = this.getScene().createEntity();

			this.getScene().addComponents(projectile,
				new CrunchJS.Components.Transform({
					x : attackerTrans.getX(),
					y : attackerTrans.getY(),
					layer : 2
				}),

				new CrunchJS.Components.RenderImage({
					image : 'assets/cannonball.gif'
				}),

				new CrunchJS.Components.Physics({
					velocityX : 10,
					objectId : projectile,
					mass : 0	
				}),

				new CrunchJS.Components.Body({
					width : 2,
					height : 2
				}),

				new CloseContact.Components.Projectile({
					id : enemyTrans.entityId,
					speed : 50,
					dmg : attackerActor.getAttackDmg()
				})
			);

			attackerActor.setLastAttackTime(currentTime);		
		}
		// Not in distance
		else{

			// Check if it is the right path
			if(path){
				var steps = path.getSteps(),
					endStep = steps[steps.length-1];

				// If the path ends at a spot that is not near the target, create a new path
				if(!goog.math.nearlyEquals(endStep.x, enemyTrans.getX(), 10) || !goog.math.nearlyEquals(endStep.y, enemyTrans.getY(), 10)){
					this.getScene().removeComponent(entity, 'Path');

					// Find the new path
					this.getScene().addComponent(entity, new CrunchJS.Components.PathQuery({
						start : {
							x : attackerTrans.getX(),
							y : attackerTrans.getY()
						},
						end : {
							x : enemyTrans.getX(),
							y : enemyTrans.getY()
						},
						gridId : 1
					}))
				}

			}
			// Add the path
			else {
				this.getScene().addComponent(entity, new CrunchJS.Components.PathQuery({
					start : {
						x : attackerTrans.getX(),
						y : attackerTrans.getY()
					},
					end : {
						x : enemyTrans.getX(),
						y : enemyTrans.getY()
					},
					gridId : 1
				}))
			}
		}
	}


};