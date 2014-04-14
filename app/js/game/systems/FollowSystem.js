/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.FollowSystem');

goog.require('CrunchJS.System');


CloseContact.Systems.FollowSystem = function() {

};

goog.inherits(CloseContact.Systems.FollowSystem, CrunchJS.System);

CloseContact.Systems.FollowSystem.prototype.name = 'FollowSystem';

CloseContact.Systems.FollowSystem.prototype.activate = function() {

	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Follow'));
};

CloseContact.Systems.FollowSystem.prototype.processEntity = function(frame, entity) {
	var follow = this.getScene().getComponent(entity, 'Follow'),
		targetTrans = this.getScene().getComponent(follow.getEntityToFollow(), 'Transform');

		
};