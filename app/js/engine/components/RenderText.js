/**
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Components.RenderText');
goog.require('CrunchJS.Component');

/**
 * Contains data necessarry for an entity to be drawn with a text label
 * @param {String} text The actual text to display. use \n for multi-line text
 * @param {Object} offset The left/right up/down game co-ordinates to offest the text from the actual position of the entity
 * @constructor
 * @class
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.RenderText = function(obj) {
  goog.base(this, obj);

  /**
   * The actual text to display. use \n for multi-line text
   * @type {String}
   */
  this.text = obj.text ? obj.text : "set 'text' to a string";

  this.style = obj.style ? obj.style : {font: "20px Arial"};
  this.style.font = this.style.font ? this.style.font : "20px Arial";

  this.size = obj.size ? obj.size : {x:-1,y:-1};

  /**
   * where, in game co-ordinates, to place the shape relative to the center of mass
   * @type {Object}
   */
  this.offset = obj.offset ? obj.offset : {x: 0, y: 0};
  this.offset.x = this.offset.x ? this.offset.x : 0;
  this.offset.y = this.offset.y ? this.offset.y : 0;

  
  this.renderable = goog.isDefAndNotNull(obj.renderable) ? obj.renderable : true;


  this.updates = {};
};

goog.inherits(CrunchJS.Components.RenderText, CrunchJS.Component);

CrunchJS.Components.RenderText.prototype.name = 'RenderText';

CrunchJS.Components.RenderText.prototype.getText = function() {
  return this.text;
};

CrunchJS.Components.RenderText.prototype.setText = function(text) {
  if(this.text != text){
    this.text = text;
    this.hasBeenUpdated();
    this.updates.text = true;
  }
};
CrunchJS.Components.RenderText.prototype.getStyle = function() {
  return this.style;
};

CrunchJS.Components.RenderText.prototype.setStyle = function(style) {
  this.style = style;
  this.hasBeenUpdated();
  this.updates.style = true;
  this.style.font = this.style.font ? this.style.font : "20px Arial";
};
/**
 * Gets the size
 * @return {Object} The size
 */
CrunchJS.Components.RenderText.prototype.getSize = function() {
	return this.size;
};

/**
 * Sets the size
 * @param {Number} x  The width
 * @param {Number} y The height
 */
CrunchJS.Components.RenderText.prototype.setSize = function(x, y) {
	if(this.size.x != x){
		this.size.x = x;
		this.hasBeenUpdated();
    this.updates.size = true;
	}
	if(this.size.y != y){
		this.size.y = y;
		this.hasBeenUpdated();
    this.updates.size = true;
	}
};

CrunchJS.Components.RenderText.prototype.getOffset = function() {
  return this.offset;
};

CrunchJS.Components.RenderText.prototype.setOffset = function(x,y) {
  if(this.offset.x != x){
    this.offset.x = x;
    this.hasBeenUpdated();
    this.updates.offset=true;
  }
  if(this.offset.y != y){
    this.offset.y = y;
    this.hasBeenUpdated();
    this.updates.offset=true;
  }
};

CrunchJS.Components.RenderText.prototype.getRenderable = function() {
  return this.renderable;
};

CrunchJS.Components.RenderText.prototype.setRenderable = function(renderable) {
  if(this.renderable != renderable){
    this.renderable = renderable;
    this.updates.renderable = true;
    this.hasBeenUpdated();
  }
};

CrunchJS.Components.RenderText.prototype.getUpdates = function() {
	var obj = {};
  
  if(this.updates.text){
    obj.text = this.getText();
  }
  if(this.updates.style){
    obj.style = this.getStyle();
  }  
  if(this.updates.size){
    obj.size = this.getSize()
  }
  if(this.updates.offset){
    obj.offset = this.getOffset()
  }


  return obj;
};

CrunchJS.Components.RenderText.prototype.resetUpdates = function() {
	this.updates = {};
};
