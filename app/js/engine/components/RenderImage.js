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
CrunchJS.Components.RenderImage = function(image) {
  goog.base(this);

  /**
   * The image name/path
   * @type {String}
   */
  this.image = image ? image : 'http://i.imgur.com/mzcrP01.jpg';
};

goog.inherits(CrunchJS.Components.RenderImage, CrunchJS.Component);

CrunchJS.Components.RenderImage.prototype.name = 'RenderImage';
