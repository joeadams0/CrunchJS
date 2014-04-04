/**
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Components.RenderText');
goog.require('CrunchJS.Component');

/**
 * Contains data necessarry for an entity to be drawn with a text label
 * @param {String} type The code-name of the kind of shape to draw (Rectangle, Triangle...)
 * @param {String} size The dimensions used by the rendering system to scale the shape
 * @constructor
 * @class
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.RenderText = function(obj) {
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
};

goog.inherits(CrunchJS.Components.RenderText, CrunchJS.Component);

CrunchJS.Components.RenderText.prototype.name = 'RenderText';
