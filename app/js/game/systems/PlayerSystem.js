/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Systems.PlayerSystem');

goog.require('CrunchJS.System');
goog.require('CrunchJS.Components.RenderText')

/**
 * [PlayerSystem description]
 * @constructor
 * @class
 */
CloseContact.Systems.PlayerSystem = function() {
	goog.base(this);
};

goog.inherits(CloseContact.Systems.PlayerSystem, CrunchJS.System);

CloseContact.Systems.PlayerSystem.prototype.name = 'PlayerSystem';

CloseContact.Systems.PlayerSystem.prototype.activate = function() {
	this.setEntityComposition(this.getScene().createEntityComposition().all('Transform', 'Player'));
};


CloseContact.Systems.PlayerSystem.prototype.processEntity = function(frame, entityId) {
	var player = this.getScene().getComponent(entityId, 'Player'),
		trans = this.getScene().getComponent(entityId, 'Transform'),
		renderText = this.getScene().getComponent(entityId, 'RenderText');

	if(!renderText){
		
		renderText = new CrunchJS.Components.RenderText({
	        style: {
	          font: "5px",
	          fill: "white"
	        },
	        offset: {
	          x: 0,
	          y: -8
	        }
		});

		this.getScene().addComponent(entityId, renderText);
	}

	renderText.setText("User"+player.getPId());
};