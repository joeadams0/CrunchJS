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
  goog.base(this);

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
};

goog.inherits(CrunchJS.Components.RenderText, CrunchJS.Component);

CrunchJS.Components.RenderText.prototype.name = 'RenderText';
