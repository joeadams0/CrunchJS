/**
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Components.RenderImage');
goog.require('CrunchJS.Component');

/**
 * Contains data necessarry for an entity to be drawn with a static sprite
 * @param {String} image The image name -- '/path/to/img.png'
 * @constructor
 * @class
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.RenderImage = function(obj) {
  goog.base(this, obj);

  /**
   * The image name/path
   * @type {String}
   */
  this.image = obj.image ? obj.image : 'star-on.png';

  // -1 indicates for the RenderingSystem to use the default size of the image as the size of the object.
  this.size = obj.size ? obj.size : {x: -1, y: -1};
  this.size.x = this.size.x ? this.size.x : -1;
  this.size.y = this.size.y ? this.size.y : -1;

  // where, in game co-ordinates, to place the shape relative to the center of mass
  this.offset = obj.offset ? obj.offset : {x: 0, y: 0};
  this.offset.x = this.offset.x ? this.offset.x : 0;
  this.offset.y = this.offset.y ? this.offset.y : 0;

  this.updates = {};
};

goog.inherits(CrunchJS.Components.RenderImage, CrunchJS.Component);

CrunchJS.Components.RenderImage.prototype.name = 'RenderImage';

CrunchJS.Components.RenderImage.prototype.getImage = function() {
  return this.image;
};

CrunchJS.Components.RenderImage.prototype.setImage = function(image) {
  if(this.image != image){
    this.image = image;
    this.hasBeenUpdated();
    this.updates.image = true;
  }
};
/**
 * Gets the size
 * @return {Object} The size
 */
CrunchJS.Components.RenderImage.prototype.getSize = function() {
	return this.size;
};

/**
 * Sets the size
 * @param {Number} x  The width
 * @param {Number} y The height
 */
CrunchJS.Components.RenderImage.prototype.setSize = function(x, y) {
	if(this.size.x != x){
		this.size.x = x;
		this.hasBeenUpdated();
		this.updates.size = {};
    this.updates.size.x = x;
	}
	if(this.size.y != y){
		this.size.y = y;
		this.hasBeenUpdated();
		this.updates.size = {};
    this.updates.size.y = y;
	}
};

CrunchJS.Components.RenderImage.prototype.getOffset = function() {
  return this.offset;
};

CrunchJS.Components.RenderImage.prototype.setOffset = function(x,y) {
  if(this.offset.x != x){
    this.offset.x = x;
    this.hasBeenUpdated();
    this.updates.offset = {};
    this.updates.offset.x=true;
  }
  if(this.offset.y != y){
    this.offset.y = y;
    this.hasBeenUpdated();
    this.updates.offset = this.updates.offset ? this.updates.offset : {};
    this.updates.offset.y=true;
  }
};

CrunchJS.Components.RenderImage.prototype.getUpdates = function() {
	return goog.object.filter(this, function(obj, key) {
		if(!goog.isFunction(obj))
      if(!goog.isObject(obj))
			  return this.updates[key];
      else
        return true;
	}, this);
};

CrunchJS.Components.RenderImage.prototype.resetUpdates = function() {
	this.updates = undefined;
};
