/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.System');

goog.require('goog.structs');
goog.require('goog.structs.Set');

/**
 * Creates a basic system. This class is designed to be extended. 
 * Systems hold all of the logic for the game. They operate on a set of entities that they are interested in.
 * For instance, the Physics system will operate on all of the entities with a 
 * physics component and a position component. 
 *
 * The activate method is designed to be overwritten, and in it to specify the entity composition. 
 * Once the entity composition is defined, the system will automatically track all of
 * the entities that are active and that you are interested in. These will be put in the
 * activeEntities set which you can access through the getActiveEntities method. 
 *
 * @class The System Class
 * @constructor
 * 
 * @example
 *
 * goog.require('CrunchJS.System');
 *
 * var ExampleSystem = function(){
 * 	// Initialize here
 * }
 *
 * goog.inherits(ExampleSystem, CrunchJS.System);
 *
 * ExampleSystem.prototype.name = "ExampleSystem";
 *
 * ExampleSystem.prototype.activate = function(){
 * 	this.setEntityComposition(this.getScene().createEntityComposition()
 * 	.all('ExampleComp', 'ExampleComp1')
 * 	.one('ExampleComp2', 'ExampleComp3')
 * 	.exclude('ExampleComp4', 'ExampleComp5'));
 * }
 *
 * // Called once per frame per entity
 * ExampleSystem.prototype.processEntity = function(entityId){
 * 	// Process the entity here
 * }
 *
 * 
 * 	
 */
CrunchJS.System = function() {
	/**
	 * The scene that the system is a part of
	 * @type {CrunchJS.Scene}
	 * @protected
	 */
	this._scene = null;

	/**
	 * A set of active entities that this system is interested in
	 * @type {goog.structs.Set}
	 * @protected
	 */
	this._activeEntities = new goog.structs.Set();

	/**
	 * The composition of the entities that the system is interested in
	 * @type {CrunchJS.EntityComposition}
	 */
	this._entityComposition = null;

	
};

/**
 * Initialize your system here. This method is called when the scene the system is in gets activated. Meant to be overwritten, but remember to call the super method
 */
CrunchJS.System.prototype.activate = function() {
};

/**
 * Called when the scene this system is a part of is deactivated
 */
CrunchJS.System.prototype.deactivate = function() {
};

/**
 * A function to process all entities in the system. Called every frame. 
 * This can be overwritten, but processEntity will not be called unless this method is called.
 * @param  {CrunchJS.Frame} frame The current frame
 */
CrunchJS.System.prototype.process = function(frame) {
	var self = this;
	goog.structs.forEach(this.getActiveEntities(), function(entityId) {
		self.processEntity(frame, entityId);
	});
};

/**
 * Processes each active entity every frame
 * @param  {CrunchJS.Frame} frame    The current frame
 * @param  {number} entityId The entity to process
 */
CrunchJS.System.prototype.processEntity = function(frame, entityId) {};

/**
 * Gets the scene the system is a part of
 * @return {CrunchJS.Scene} The scene
 */
CrunchJS.System.prototype.getScene = function() {
	return this._scene;
};

/**
 * Sets the scene that this system is a part of
 * @param {CrunchJS.Scene} scene The scene
 */
CrunchJS.System.prototype.setScene = function(scene) {
	this._scene = scene;
	this.setListeners();
};

/**
 * Sets the listeners for the system
 */
CrunchJS.System.prototype.setListeners = function() {
	var entChangedListener = goog.bind(this.entityChanged, this);
	var entDestroyedListener = goog.bind(this.entityDestroyed, this);
	var entEnabledListener = goog.bind(this.entityEnabled, this);
	var entDisabledListener = goog.bind(this.entityDisabled, this);


	this.getScene().addEventListener(CrunchJS.Events.EntityChanged, entChangedListener);
	this.getScene().addEventListener(CrunchJS.Events.EntityDestroyed, entDestroyedListener);
	this.getScene().addEventListener(CrunchJS.Events.EntityEnabled, entEnabledListener);
	this.getScene().addEventListener(CrunchJS.Events.EntityDisabled, entDisabledListener);
};

/**
 * Gets the active entities for the system
 * @return {goog.structs.Set} The set of active entities
 */
CrunchJS.System.prototype.getActiveEntities = function() {
	return this._activeEntities;
};

/**
 * Checks if we are interested in the entity. If we are, it adds it to the actives set
 * @param  {number} entityId The entity Id
 */
CrunchJS.System.prototype.check = function(entityId) {
	
	if(this.getEntityComposition() != null && this.getScene().matchesComposition(entityId, this.getEntityComposition())){
		this.getActiveEntities().add(entityId);
		this.getScene().log("Entity " +entityId + " added to " + this.name, CrunchJS.LogLevels.DEBUG);
	}
};

/**
 * Listens for an entity composition to be changed
 * @param  {number} entityId The entity id
 */
CrunchJS.System.prototype.entityChanged = function(entityId) {
	this.check(entityId);
};

/**
 * Listens for entities to be destroyed
 * @param  {number} entityId The entity id
 */
CrunchJS.System.prototype.entityDestroyed = function(entityId) {
	
	var success = this.getActiveEntities().remove(entityId);

	if(success)
		this.getScene().log("Entity " +entityId + " removed from " + this.name, CrunchJS.LogLevels.DEBUG);
};

/**
 * Listens for entities to be enabled 
 * @param  {number} entityId The entity id
 */
CrunchJS.System.prototype.entityEnabled = function(entityId) {
	this.check(entityId);
};

/**
 * Listens for entities to be disabled
 * @param  {number} entityId The Id of the entity
 */
CrunchJS.System.prototype.entityDisabled = function(entityId) {
	var success = this.getActiveEntities().remove(entityId);

	if(success)
		this.getScene().log("Entity " +entityId + " removed from " + this.name, CrunchJS.LogLevels.DEBUG);
};

/**
 * Gets the entity composition that the system is interested in
 * @return {CrunchJS.EntityComposition} The composition
 */
CrunchJS.System.prototype.getEntityComposition = function() {
	return this._entityComposition;
};

/**
 * Sets the entity composition that the system is interested in
 * @param {CrunchJS.EntityComposition} comp The composition
 */
CrunchJS.System.prototype.setEntityComposition = function(comp) {
	this._entityComposition = comp;
};
