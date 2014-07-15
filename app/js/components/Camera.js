/**
 * The camera Doesn't work unless it's got a Transform attached to it. 
 * the x/y of the Transfrom is the upper left corner of the camera viewport
 * the screenSpace is the portion of the canvas on which the viewport is drawn
 * the lensSize is the in-game distance from the Transform x/y in which an entity must be in order to be visible/rendered
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Components.Camera');
goog.require('CrunchJS.Component');

/**
 * Contains data necessary for the RenderingSystem to draw from this entity's viewpoint
 * @param {Boolean} isActive If true, RenderingSystem will draw from this viewpoint
 * @param {Object} screenSpace properties: ux,uy,lx,ly form the Upper left and Lower right pixel coordinates available to be rendered in
 * @param {Object} lensSize properties: width,height the Transform/gameworld positions to render
 * @constructor
 * @class
 * @extends {CrunchJS.Component}
 */
CrunchJS.Components.Camera = function(o) {
  goog.base(this, o);

  /**
   * If true, RenderingSystem will draw from this viewpoint
   * @type {Boolean}
   */
  this.isActive = o.isActive ? o.isActive : false;

  /**
   * properties: ux,uy,lx,ly form the Upper left and Lower right pixel coordinates available to be rendered in
   * @type {Object}
   */
  this.screenSpace = o.screenSpace ? o.screenSpace : {ux:0,uy:0,lx:400,ly:400};
  this.screenSpace.ux = this.screenSpace.ux ? this.screenSpace.ux : 0;
  this.screenSpace.uy = this.screenSpace.uy ? this.screenSpace.uy : 0;
  this.screenSpace.lx = this.screenSpace.lx ? this.screenSpace.lx : 400;
  this.screenSpace.ly = this.screenSpace.ly ? this.screenSpace.ly : 400;


  /**
   * properties: width,height the Transform/gameworld positions to render
   * @type {Object}
   */
  this.lensSize = o.lensSize ? o.lensSize : {width:400,height:400};
  this.lensSize.width = this.lensSize.width ? this.lensSize.width : 400;
  this.lensSize.height = this.lensSize.height ? this.lensSize.height : 400;

  this.constraints = o.constraints;
};

goog.inherits(CrunchJS.Components.Camera, CrunchJS.Component);

CrunchJS.Components.Camera.prototype.name = 'Camera';
