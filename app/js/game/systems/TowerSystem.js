/**
 * @author  Joe Adams
 */

goog.provide('CloseContact.Systems.TowerSystem');

goog.require('CrunchJS.System');
goog.require('CloseContact.Components.Attack');

goog.require('goog.structs');

CloseContact.Systems.TowerSystem = function() {

};

goog.inherits(CloseContact.Systems.TowerSystem, CrunchJS.System);

CloseContact.Systems.TowerSystem.prototype.name = 'TowerSystem';

CloseContact.Systems.TowerSystem.prototype.activate = function() {
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Tower', 'Actor'));
};


CloseContact.Systems.TowerSystem.prototype.process = function(frame) {
	var actors = this.getScene().getComponentsByType('Actor'),
		scene = this.getScene();

	goog.structs.forEach(this.getActiveEntities(), function(entity) {
		if(scene.getComponent(entity, 'Attack')){
			return;
		}
		var towerTrans = scene.getComponent(entity, 'Transform'),
			towerActor = scene.getComponent(entity, 'Actor');

		// Check if any actors are in range 
		goog.structs.some(actors, function(actor) {

			// Dont attack youself
			if(entity == actor.entityId || towerActor.getTeam() == actor.getTeam())
				return;


			var actorTrans = scene.getComponent(actor.entityId, 'Transform');

			var dist = towerTrans.distance(actorTrans);

			if(dist<= towerActor.getAttackRange()){

				scene.addComponent(entity, new CloseContact.Components.Attack({
					entity : actor.entityId
				}));

				return true;
			}


		}, this);
	}, this);
};