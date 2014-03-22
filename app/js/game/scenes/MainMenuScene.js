/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Scenes.MainMenuScene');

goog.require('CrunchJS.Scene');

/**
 * The Main Menu Scene
 * @constructor
 * @class 
 */
CloseContact.Scenes.MainMenuScene = function() {
	goog.base(this);
};

goog.inherits(CloseContact.Scenes.MainMenuScene, CrunchJS.Scene);

CloseContact.Scenes.MainMenuScene.prototype.name = 'MainMenuScene';

CloseContact.Scenes.MainMenuScene.prototype.activate = function(data) {
	goog.base(this, 'activate', data);

	var button = $('<button class="btn" id="begin-button">Begin!</button>');

    $("#game").append(button);

    var self = this;

    button.click(function(e) {
    	CrunchJS.world.transitionScene('GameScene');
    });

};

CloseContact.Scenes.MainMenuScene.prototype.deactivate = function() {
	$("#game").html('');
};