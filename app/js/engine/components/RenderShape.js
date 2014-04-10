/**
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Components.RenderShape');
goog.require('CrunchJS.Component');

/**
 * Contains data necessarry for an entity to be drawn with a defined shape
 * @param {String} type The code-name of the kind of shape to draw (Rectangle, Triangle...)
 * @param {String} size The dimensions used by the rendering system to scale the shape
 * @constructor
 * @class
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.RenderShape = function(obj) {
  goog.base(this);

  /**
   * The code-name of the kind of shape to draw (Rectangle, Triangle...)
   * @type {String}
   */
  this.type = obj.type ? obj.type : 'rectangle';

  // -1 indicates for the RenderingSystem to use the default size of the image as the size of the object.
  this.size = obj.size ? obj.size : {x: -1, y: -1};
  this.size.x = this.size.x ? this.size.x : -1;
  this.size.y = this.size.y ? this.size.y : -1;

  this.color = obj.color ? obj.color : 0x999999;

  // must explicitly set to true, or it won't fill
  this.fill = obj.fill ? obj.fill : false;

  // where, in game co-ordinates, to place the shape relative to the center of mass
  this.offset = obj.offset ? obj.offset : {x: 0, y: 0};
  this.offset.x = this.offset.x ? this.offset.x : 0;
  this.offset.y = this.offset.y ? this.offset.y : 0;

  this.updates={};
};

goog.inherits(CrunchJS.Components.RenderShape, CrunchJS.Component);

CrunchJS.Components.RenderShape.prototype.name = 'RenderShape';

CrunchJS.Components.RenderShape.prototype.getType = function() {
  return this.type;
};

CrunchJS.Components.RenderShape.prototype.setType = function(type) {
  if(this.type != type){
    this.type = type;
    this.hasBeenUpdated();
    this.updates.type = true;
  }
};
/**
 * Gets the size
 * @return {Object} The size
 */
CrunchJS.Components.RenderShape.prototype.getSize = function() {
	return this.size;
};

/**
 * Sets the size
 * @param {Number} x  The width
 * @param {Number} y The height
 */
CrunchJS.Components.RenderShape.prototype.setSize = function(x, y) {
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

CrunchJS.Components.RenderShape.prototype.getColor = function() {
  return this.color;
};

CrunchJS.Components.RenderShape.prototype.setColor = function(color) {
  if(this.color != color){
    this.color = color;
    this.hasBeenUpdated();
    this.updates.color = true;
  }
};
CrunchJS.Components.RenderShape.prototype.getFill = function() {
  return this.fill;
};

CrunchJS.Components.RenderShape.prototype.setFill = function(fill) {
  if(this.fill != fill){
    this.fill = fill;
    this.hasBeenUpdated();
    this.updates.fill = true;
  }
};
CrunchJS.Components.RenderShape.prototype.getOffset = function() {
  return this.offset;
};

CrunchJS.Components.RenderShape.prototype.setOffset = function(x,y) {
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

CrunchJS.Components.RenderShape.prototype.getUpdates = function() {
  var obj = {};
	
  if(this.updates.type){
    obj.type = this.getType();
  }
  if(this.updates.size && (this.updates.size.x || this.updates.size.y)){
    obj.size = this.getSize();
  }
  if(this.updates.color){
    obj.color = this.getColor()
  }
  if(this.updates.fill){
    obj.fill = this.getFill()
  }
  if(this.updates.offset && (this.updates.offset.y || this.updates.offset.x)){
    obj.offset = this.getOffset()
  }


  return obj;
};

CrunchJS.Components.RenderShape.prototype.update = function(obj) {
  goog.object.forEach(obj, function(el, key) {

    this[key] = el;
  }, this);
};

CrunchJS.Components.RenderShape.prototype.resetUpdates = function() {
	this.updates = {};
};
