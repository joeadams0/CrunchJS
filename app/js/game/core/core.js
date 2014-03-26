/**
 * @author Joe Adams
 */
goog.provide('CloseContact.Core');
goog.provide('CloseContact.Scenes');
goog.provide('CloseContact.Components');

goog.require('CrunchJS');
goog.require('CloseContact.Scenes.MainMenuScene');
goog.require('CloseContact.Scenes.GameScene');

goog.require('box2d.World');
goog.require('goog.array');

/**
 * The Game Object
 *  
 * @constructor
 * @this {CloseContact}
 */
CloseContact.Core = function(){
	var simulation, 
		world;

	world = new CrunchJS.World();

	var scenes;
	if(world.isSim()){
		scenes = [
			new CloseContact.Scenes.GameScene()
		];
	} 
	else{
		scenes = [
			new CloseContact.Scenes.MainMenuScene(),
			new CloseContact.Scenes.GameScene()
		];
	}

	goog.array.forEach(scenes, function(scene) {
		world.addScene(scene);
	});


	world.run();

};

var game = new CloseContact.Core();

