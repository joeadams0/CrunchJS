/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.AttackSystem');

goog.require('CrunchJS.System');


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
			enemyActor = this.getScene().getComponent(attack.getEntity(), 'Actor');


		// Check if still in distance
		if(attackerTrans.distance(enemyTrans) <= attackerActor.getAttackRange()){
			CrunchJS.world.log(entity+' ATTACKED: '+attack.getEntity());

			attackerActor.setLastAttackTime(currentTime);
		}
		else{
			debugger;
			this.getScene().removeComponent(entity, 'Attack');
		}
	}


};