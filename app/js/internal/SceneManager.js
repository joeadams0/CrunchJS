/**
 * @author Joe Adams
 */


goog.provide('CrunchJS.Internal.SceneManager');

goog.require('goog.structs.Map');
goog.require('goog.structs');

/**
 * Constructs a new Scene Manager
 * @constructor
 * @class The Scene Manager Class
 */
CrunchJS.Internal.SceneManager = function() {
	/**
	 * Maps the name of the scene to the scene
	 * @type {goog.structs.Map}
	 * @private 
	 */
	this._scenes = new goog.structs.Map();

	/**
	 * The current scene
	 * @type {CrunchJS.Internal.Scene}
	 * @private
	 */
	this._currentScene = null;

	return this;
};

/**
 * Processes the current Scene
 * @param  {CrunchJS.Frame} frame The current frame
 */
CrunchJS.Internal.SceneManager.prototype.process = function(frame) {
	if(this.getCurrentScene() != null)
		this.getCurrentScene().process(frame);
};

/**
 * Adds a Scene to the scene manager
 * @param {CrunchJS.Internal.Scene} scene The Scene to add
 */
CrunchJS.Internal.SceneManager.prototype.addScene = function(scene) {
	this._scenes.set(scene.name, scene);

	if(this.getCurrentScene() == null){
		this.transitionScene(scene.name);
	}

	return true;
};

/**
 * Removes the Scene from the world
 * @param  {CrunchJS.Internal.Scene|String} scene The Scene object or the name of the scene object
 * @return {boolean}       Whether the scene object was found and removed
 */
CrunchJS.Internal.SceneManager.prototype.removeScene = function(scene) {

	// If the scene is active, find a new one
	if(this.isCurrentScene(scene))
		this.findNewScene();

	// If it is the name of the scene
	if(typeof scene == 'string')
		return this._scenes.remove(scene);
	
	else
		return this._scenes.remove(scene.name);
};

/**
 * Finds a new scene to be active
 */
CrunchJS.Internal.SceneManager.prototype.findNewScene = function() {

	// Checks if the  scene is the current Scene
	var sceneChecker = function(scene, name) {
		if(name != this.getCurrentScene().name){
			this.transitionScene(scene);
			return true;
		}
	};

	sceneChecker = goog.bind(sceneChecker, this);

	var success = goog.structs.some(this._scenes, sceneChecker);

	// If it couldnt find one, set to null
	if(!success)
		this.transitionScene(null);
};

/**
 * Checks if the scene is the current scene
 * @param  {CrunchJS.Scene}  scene The Scene
 * @return {Boolean}       True if it is the scene
 */
CrunchJS.Internal.SceneManager.prototype.isCurrentScene = function(scene) {
	if(this.getCurrentScene() == null)
		return false;
	else{
		if(typeof scene  == 'string')
			return scene == this.getCurrentScene().name;
		else
			return scene.name == this.getCurrentScene().name;
	}

};
/**
 * Gets the Scene
 * @param  {String} sceneName The Scene Name
 * @return {CrunchJS.Internal.Scene}   The Scene
 */
CrunchJS.Internal.SceneManager.prototype.getScene = function(sceneName) {
	return this._scenes.get(sceneName);
};

/**
 * Gets the Current Scene
 * @return {CrunchJS.Internal.Scene} The Current Scene
 */
CrunchJS.Internal.SceneManager.prototype.getCurrentScene = function() {
	return this._currentScene;
};

/**
 * Transitions from the current scene to the scene corrisponding to the specified name
 * @param  {String} sceneName The Scene Name
 * @param  {?Object} data     Optional data that will be passed into the new scene's activate method
 * @return {Boolean}          Whether the new scene was found and the transition occured successfully.
 */
CrunchJS.Internal.SceneManager.prototype.transitionScene = function(sceneName, data) {
	var newScene = this.getScene(sceneName);
	var oldCurrentScene = this.getCurrentScene();

	if(newScene !== undefined){

		if(oldCurrentScene != null)
			oldCurrentScene.deactivate();

		this._currentScene = newScene;
		
		if(this.getCurrentScene() != null)
			this.getCurrentScene().activate(data);

		return true;
	}
	else
		return false;
};

/**
 * Post an event to the current scene
 * @param  {String} eventName The event name
 * @param  {Object} data      The event data
 */
CrunchJS.Internal.SceneManager.prototype.fireEvent = function(eventName, data){
	var scene = this.getCurrentScene();

	if(scene != null)
		scene.fireEvent(eventName, data);
};
