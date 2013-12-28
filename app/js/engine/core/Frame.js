/**
 * @author Joe Adams
 */

goog.provide('Engine.Frame');


/**
 * Creates a new Frame 
 * @constructor
 * @struct
 */
Engine.Frame = function(id, startTime, endTime, delta) {
	/**
	 * Unique Frame Id
	 * @type {Number|String}
	 */
	this.id = id;

	/**
	 * The Start Time of the Frame in Milliseconds
	 * @type {Number}
	 */
	this.startTime = startTime;

	/**
	 * The End Time of the Frame in Milliseconds
	 * @type {Number}
	 */
	this.endTime = endTime;

	/**
	 * The delta time between the start of the this frame and the start of last frame in Milliseconds
	 * @type {Number}
	 */
	this.delta = delta;
};