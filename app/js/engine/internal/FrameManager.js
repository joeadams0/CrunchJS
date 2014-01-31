/**
 * @author Joe Adams
 */

goog.provide('CrunchJS.Internal.FrameManager');

goog.require('CrunchJS.Frame');

/**
 * Creates a new Frame Manager
 * @constructor
 * @class Manages the Frames for the CrunchJS (for internal use)
 * @this {CrunchJS.Internal.FrameManager}
 */
CrunchJS.Internal.FrameManager = function() {

	/**
	 * The Next Id of the frame
	 * @type {Number}
	 */
	this.nextId = 1;

	/**
	 * The current frame
	 * @type {CrunchJS.Frame}
	 */
	this.frame = null;

};

/**
 * Updates the endTime of the current frame
 */
CrunchJS.Internal.FrameManager.prototype.frameOver = function() {
	var time = goog.now();
	this.frame.endTime = time;
};

/**
 * Creates a new frame
 * @return {CrunchJS.Frame} The new Frame
 * @this {CrunchJS.Internal.FrameManager}
 */
CrunchJS.Internal.FrameManager.prototype.nextFrame = function() {
	var time = goog.now();

	var delta = null;
	if(this.frame != null){	
		delta = time - this.frame.startTime;
	}

	this.frame = new CrunchJS.Frame(this.nextId, time, null, delta);

	this.nextId++;
	return this.frame;
};