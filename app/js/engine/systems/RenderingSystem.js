/**
 * The best rendering system ever made
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Systems.RenderingSystem');
goog.require('CrunchJS.System');

/**
 * Creates the Rendering System. If you're making a game, you probably need one of these.
 * @param {Object} canvasData Data about the canvas
 * @constructor
 * @class
 */
CrunchJS.Systems.RenderingSystem = function(canvasData){
  goog.base(this);
  // Configure PIXI usage
  this.stage = new PIXI.Stage(0xFFF0FF);
  this.renderer = new PIXI.autoDetectRenderer(
    (canvasData.width ? canvasData.width : 400),
    (canvasData.height ? canvasData.height : 400)
  );
  document.body.appendChild(this.renderer.view);
  this.sprites = []; // an array of Entities that are in the stage
  this.cam = null;
};

goog.inherits(CrunchJS.Systems.RenderingSystem, CrunchJS.System);

CrunchJS.Systems.RenderingSystem.prototype.name = 'RenderingSystem';

CrunchJS.Systems.RenderingSystem.prototype.activate = function() {
  goog.base(this, 'activate');
  this.setEntityComposition(
    this.getScene().createEntityComposition().one('RenderImage', 'RenderShape', 'Camera').all('Transform')
  );
};

CrunchJS.Systems.RenderingSystem.prototype.process = function(f){
  goog.base(this, 'process');
  
  // the code that actually tries to re-draw to the Canvas
  var me = this;                    // explicit reference
  window.requestAnimFrame( function(){     // this is from JavaScript and prevents exceeding framerate
    me.renderer.render(me.stage);   // PIXI call to render the stage
  });
};

CrunchJS.Systems.RenderingSystem.prototype.processEntity = function(f, eId){
  // variable declarations
  var sprite,                                       // the PIXI sprite object for this entity
      scene = this.getScene(),                      // the CrunchJS Scene object in which this entity resides
      transf = scene.getComponent(eId, 'Transform'),// the transform component for this entity
      imgRenC = scene.getComponent(eId, 'RenderImage'),  // the RenderImage component for this entity (which it may not have)
      shapeRenC = scene.getComponent(eId, 'RenderShape'),// the RenderShape component for this entity (which it may not have)
      cameraC = scene.getComponent(eId, 'Camera')   // this entity's Camera component (which it may not have)
      ;
  // is this THE camera?
  if (cameraC != null && cameraC.isActive) {
    this.setCam(cameraC, eId);
  }
  
  if (imgRenC != null || shapeRenC != null) {
    // Does the PIXI sprite list have a representation of this entity?
    if (this.sprites[eId] != undefined){
      sprite = this.sprites[eId];  // access the sprite
    } else {  // the entity has no PIXI representation, so we give it one
      // create the PIXI Sprite for this entity
      if (imgRenC == null) {
        // TODO: utilize info from RenderShape component to actually draw the thing
        sprite = new PIXI.Sprite( PIXI.Texture.fromImage('star-on.png') );
      } else {
        sprite = new PIXI.Sprite( PIXI.Texture.fromImage(imgRenC.image) );
      }
      this.stage.addChild(sprite);  // add it to the stage
      this.sprites[eId] = sprite;   // and the stage's sprite-list
    }

    // after handling PIXI representations of entity
    // (sprite => entity)
    ///////////////////////////////////
    // Do the actual visual updating //
    ///////////////////////////////////
    // translate the Transform position to the onscreen position
    sprite.position.x = this.translatePosition(transf, 'x');
    sprite.position.y = this.translatePosition(transf, 'y');
  }
};

CrunchJS.Systems.RenderingSystem.prototype.setCam = function(camComp, eId) {
  this.cam = {
    cam: camComp,
    id: eId
  };
};

CrunchJS.Systems.RenderingSystem.prototype.translatePosition = function(transComp, partName) {
  // if the camera hasn't been assigned, just do a direct translation
  if(this.cam == null){
    switch(partName) {
      case 'x':
      case 'X':
        return transComp.x;
      case 'y':
      case 'Y':
      default:
        return transComp.y;
    }
  } else {
    var camTransComp = this.getScene().getComponent(this.cam.id, 'Transform');
    // these need to be positive in order for the entity to show up
    var xDist = transComp.x - camTransComp.x;
    var yDist = transComp.y - camTransComp.y;

    // if greater than 1, won't be onscreen
    // if less than 1, but greater than 0, will be onscreen
    var xFactor = xDist/this.cam.cam.lensSize.width;
    var yFactor = yDist/this.cam.cam.lensSize.height;

    // this is the lengths of the onscreen viewport
    var screenX = this.cam.cam.screenSpace.lx - this.cam.cam.screenSpace.ux;
    var screenY = this.cam.cam.screenSpace.ly - this.cam.cam.screenSpace.uy;

    var eXpos = (xFactor * screenX) + this.cam.cam.screenSpace.ux;
    var eYpos = (yFactor * screenY) + this.cam.cam.screenSpace.uy;

    switch(partName) {
      case 'x':
      case 'X':
        return eXpos;
      case 'y':
      case 'Y':
      default:
        return eYpos;
    }
  }
};
