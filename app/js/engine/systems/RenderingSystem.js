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

  var self = this;
  this.stage.click = function(data) {
    var bounds = self.stage.getBounds();

    var coords = {
      x : data.global.x,
      y : data.global.y
    };

    self.getScene().fireEvent('click',coords);
  };

  this.renderer = new PIXI.autoDetectRenderer(
    (canvasData.width ? canvasData.width : 600),
    (canvasData.height ? canvasData.height : 600)
  );
  $('#game').append(this.renderer.view);
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
  window['requestAnimFrame']( function(){     // this is from JavaScript and prevents exceeding framerate
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
    var size = this.getSize(eId);

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

    // translate the in-game object Size (Body or RenderImage) to the onscreen object size
    if(size){
      var bSize = {
        x: size.width,
        y: size.height
      };
      sprite.width = this.translateScale(bSize, 'x');
      sprite.height = this.translateScale(bSize, 'y');
    } 
    // else, imgRenC is default, and no body, means the scale is set to whatever the image size is, automatically.
  }
};

CrunchJS.Systems.RenderingSystem.prototype.getSize = function(id) { 
  var body = this.getScene().getComponent(id, 'Body'),
    imgRenC = this.getScene().getComponent(id, 'RenderImage'),
    size = {};

  if(body && imgRenC.size.x == -1 && imgRenC.size.y == -1){
      size.width = body.getSize().width;
      size.height = body.getSize().height;
  }
  else if(imgRenC.size.x != -1 && imgRenC.size.y != -1){
    size.width = imgRenC.size.x;
    size.height = imgRenC.size.y;
  } 
  return size;
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
    var camTransComp = this.getScene().getComponent(this.cam.id, 'Transform'),
      size = this.getSize(transComp.entityId);


    // these need to be positive in order for the entity to show up
    var xDist = transComp.x - camTransComp.x - size.width/2; 
    var yDist = transComp.y - camTransComp.y - size.height/2;

    // if greater than 1, won't be onscreen
    // if less than 1, but greater than 0, will be onscreen
    var xFactor = xDist/this.cam.cam.lensSize.width;
    var yFactor = yDist/this.cam.cam.lensSize.height;

    // this is the lengths of the onscreen viewport
    var screenX = this.cam.cam.screenSpace.lx - this.cam.cam.screenSpace.ux;
    var screenY = this.cam.cam.screenSpace.ly - this.cam.cam.screenSpace.uy;

    var eXpos = (xFactor * screenX) + this.cam.cam.screenSpace.ux + this.cam.cam.screenSpace.lx/2;
    var eYpos = (yFactor * screenY) + this.cam.cam.screenSpace.uy + this.cam.cam.screenSpace.ly/2;

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

// size is an obj like {x: number, y: number}
// partName is a string like "x" or "Y"
CrunchJS.Systems.RenderingSystem.prototype.translateScale = function(size, partName) {
  // if the camera hasn't been assigned, just do a direct translation
  if(this.cam == null){
    switch(partName) {
      case 'x':
      case 'X':
        return size.x;
      case 'y':
      case 'Y':
      default:
        return size.y;
    }
  } else {
    // this is the lengths of the onscreen viewport
    var screenX = this.cam.cam.screenSpace.lx - this.cam.cam.screenSpace.ux;
    var screenY = this.cam.cam.screenSpace.ly - this.cam.cam.screenSpace.uy;

    // this is the ratio of game-units to pixels (pixels/game units)
    var xFactor = screenX/this.cam.cam.lensSize.width;
    var yFactor = screenY/this.cam.cam.lensSize.height;

    var objWidth = xFactor * size.x;
    var objHeight = yFactor * size.y;

    switch(partName) {
      case 'x':
      case 'X':
        return objWidth;
      case 'y':
      case 'Y':
      default:
        return objHeight;
    }
  }
};
