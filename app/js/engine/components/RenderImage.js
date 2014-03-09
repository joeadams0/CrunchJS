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
  goog.base(this);

  /**
   * The image name/path
   * @type {String}
   */
  this.image = obj.image ? obj.image : 'star-on.png';

  // -1 indicates for the RenderingSystem to use the default size of the image as the size of the object.
  this.size = obj.size ? obj.size : {x: -1, y: -1};
  this.size.x = this.size.x ? this.size.x : -1;
  this.size.y = this.size.y ? this.size.y : -1;
};

goog.inherits(CrunchJS.Components.RenderImage, CrunchJS.Component);

CrunchJS.Components.RenderImage.prototype.name = 'RenderImage';
