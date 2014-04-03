/**
 * The best rendering system ever made
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.Systems.RenderingSystem');

goog.require('CrunchJS.System');
goog.require('CrunchJS.Components.Viewport');

goog.require('goog.object');

/**
 * Creates the Rendering System. If you're making a game, you probably need one of these.
 * @param {Object} canvasData Data about the canvas
 * @constructor
 * @class
 */
CrunchJS.Systems.RenderingSystem = function(canvasData){
  goog.base(this);

  var self = this;

  if(!canvasData){
    canvasData = {};
  }

  // Default configs
  var configs = {
    aspectRatio : {
      width : 16,
      height : 9
    },
    width : 1024,
    height : 640,
    fullscreen : true,
    backgroundColor : 0x000000,
    selector : '#game'
  };

  // Set default vals if there is no existing value
  goog.object.forEach(configs, function(el, key) {
    if(!canvasData[key])
      canvasData[key] = el;
  });

  if(!canvasData.entityId)
    canvasData.entityId = this.getScene().createEntity();

  /**
   * The Pixi Stage
   * @type {PIXI.Stage}
   */
  this.stage = new PIXI.Stage(0x000000);

  /**
   * The Pixi renderer
   * @type {PIXI.Renderer} 
   */
  this.renderer = new PIXI.autoDetectRenderer(
    canvasData.width,
    canvasData.height
  );

    /**
   * The configs for the canvas
   * @type {Object}
   */
  this.canvasData = canvasData;

  /**
   * The viewport component
   * @type {CrunchJS.Components.Viewport}
   */
  this.viewport = new CrunchJS.Components.Viewport(this.canvasData);


  // Add the canvas
  $(canvasData.selector).append(this.renderer.view);


  if(canvasData.fullscreen){
    // Listen for screen size changes
    $( window ).resize(goog.bind(this.onResize, this));
  }

  $('canvas').mousemove(goog.bind(this.onMouseMove, this));


  this.sprites = []; // an array of Entities that are in the stage
  this.cam = null;

  this.stage.click = goog.bind(this.onStageClick, this);



  // Make fullscreen
  $('canvas')[0].webkitRequestFullScreen();
};

goog.inherits(CrunchJS.Systems.RenderingSystem, CrunchJS.System);

CrunchJS.Systems.RenderingSystem.prototype.name = 'RenderingSystem';

/**
  responsible for defining what entites go in the system.
  also handles the viewport magic
*/
CrunchJS.Systems.RenderingSystem.prototype.activate = function() {
  goog.base(this, 'activate');
  this.setEntityComposition(
    this.getScene().createEntityComposition().one('RenderImage', 'RenderShape', 'Camera').all('Transform')
  );

  // Add the viewport
  this.getScene().addComponent(this.canvasData.entityId, this.viewport);

  this.getScene().addEventListener('Resize', goog.bind(this.onResize, this));
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
      cameraC = scene.getComponent(eId, 'Camera'),   // this entity's Camera component (which it may not have)
      screenSize = {};
  // is this THE camera?
  if (cameraC != null && cameraC.isActive) {
    this.setCam(cameraC, eId);
  }
  
  if (imgRenC != null || shapeRenC != null) {
    var size = this.getSize(eId);

    if(size){
      var bSize = {
        x: size.width,
        y: size.height
      };

      screenSize.width = this.translateScale(bSize, 'x');
      screenSize.height = this.translateScale(bSize, 'y');  
    }

    // Does the PIXI sprite list have a representation of this entity?
    if (this.sprites[eId] != undefined){
      sprite = this.sprites[eId];  // access the sprite
    } else {  // the entity has no PIXI representation, so we give it one
      // create the PIXI Sprite for this entity
      if (imgRenC == null) {
        // TODO: utilize info from RenderShape component to actually draw the thing
        sprite = new PIXI.Graphics();
        if (shapeRenC.type.toLowerCase() == 'rectangle') {
           sprite.beginFill(shapeRenC.color);
           sprite.drawRect(0,0,screenSize.width, screenSize.height);
        }
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
    
    var transformX = this.translatePosition(transf, 'x'),
        transformY = this.translatePosition(transf, 'y');

    // Get top left for rendering
    var left = transformX - screenSize.width/2,
        right = transformY - screenSize.height/2;

    sprite.position.x = left;
    sprite.position.y = right;

    // translate the in-game object Size (Body or RenderImage) to the onscreen object size
    sprite.width = screenSize.width;
    sprite.height =  screenSize.height

    // else, imgRenC is default, and no body, means the scale is set to whatever the image size is, automatically.
  }
};

CrunchJS.Systems.RenderingSystem.prototype.getSize = function(id) { 
  var body = this.getScene().getComponent(id, 'Body'),
    imgRenC = this.getScene().getComponent(id, 'RenderImage'),
    shapeRenC = this.getScene().getComponent(id, 'RenderShape'),
    size = {};

  if (imgRenC) {  // if the entity uses an image for rendering
    if(body && imgRenC.size.x == -1 && imgRenC.size.y == -1){
        size.width = body.getSize().width;
        size.height = body.getSize().height;
    }
    else if(imgRenC.size.x != -1 && imgRenC.size.y != -1){
      size.width = imgRenC.size.x;
      size.height = imgRenC.size.y;
    } 
  } else if (shapeRenC) {
    if(body && shapeRenC.size.x == -1 && shapeRenC.size.y == -1){
        size.width = body.getSize().width;
        size.height = body.getSize().height;
    }
    else if(shapeRenC.size.x != -1 && shapeRenC.size.y != -1){
      size.width = shapeRenC.size.x;
      size.height = shapeRenC.size.y;
    } 
  } else {
    console.log('bad component');
  }
  return size;
};

CrunchJS.Systems.RenderingSystem.prototype.setCam = function(camComp, eId) {
  this.cam = {
    cam: camComp,
    id: eId
  };
};

CrunchJS.Systems.RenderingSystem.prototype.getViewport = function() {
  return this.getScene().getComponent(this.canvasData.entityId, 'Viewport');
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
  } else if(this.getViewport()){
    var camTransComp = this.getScene().getComponent(this.cam.id, 'Transform');

    // Distances relative to cam transform
    var xRelativeToCam = transComp.x-camTransComp.x+this.cam.cam.lensSize.width/2,
        yRelativeToCam = transComp.y-camTransComp.y+this.cam.cam.lensSize.height/2,
        viewport = this.getViewport();

    // if greater than 1, won't be onscreen
    // if less than 1, but greater than 0, will be onscreen
    // The percentage of the way across the screen
    var xPercentage = xRelativeToCam/this.cam.cam.lensSize.width;
    var yPercentage = yRelativeToCam/this.cam.cam.lensSize.height;

    // Change this when want to add ux uy lx ly back
    var screenWidth = viewport.width;
    var screenHeight = viewport.height;


    var xRelativeToScreen = xPercentage * screenWidth;
    var yRelativeToScreen = yPercentage * screenHeight;

    switch(partName) {
      case 'x':
      case 'X':
        return xRelativeToScreen;
      case 'y':
      case 'Y':
      default:
        return yRelativeToScreen;
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
  } else if(this.getViewport()){
    // this is the lengths of the onscreen viewport
    // var screenX = this.cam.cam.screenSpace.lx - this.cam.cam.screenSpace.ux;
    // var screenY = this.cam.cam.screenSpace.ly - this.cam.cam.screenSpace.uy;
    var viewport = this.getViewport();
    
    var screenWidth = viewport.width;
    var screenHeight = viewport.height;

    // percentage of screen taken by this size
    var xPercentage = size.x/this.cam.cam.lensSize.width;
    var yPercentage = size.y/this.cam.cam.lensSize.height;

    var objWidth = xPercentage * screenWidth;
    var objHeight = yPercentage * screenHeight;

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

CrunchJS.Systems.RenderingSystem.prototype.onResize = function() {  
  var width = $(window).width(),
      height = $(window).height(),
      viewport = this.getViewport();

  var widthUnit = width / viewport.aspectRatio.width,
      heightUnit = height / viewport.aspectRatio.height;

    if(heightUnit < widthUnit){
      width = viewport.aspectRatio.width * heightUnit;
      height = viewport.aspectRatio.height * heightUnit;
    }
    else{
      width = viewport.aspectRatio.width * widthUnit;
      height = viewport.aspectRatio.height * widthUnit;
    }


    this.renderer.resize(width,height);

    viewport.setWidth(width);
    viewport.setHeight(height);

    if(this.cam){
      this.cam.cam.screenSpace.lx = width;
      this.cam.cam.screenSpace.ly = height;
    }
};

CrunchJS.Systems.RenderingSystem.prototype.onStageClick = function(data) {    
  this.getScene().fireEvent('click');
};

CrunchJS.Systems.RenderingSystem.prototype.onMouseMove = function(data) {
  if(this.getViewport()){
    this.getViewport().setMousePosition({
      x : data.offsetX,
      y : data.offsetY
    });
  }
};
