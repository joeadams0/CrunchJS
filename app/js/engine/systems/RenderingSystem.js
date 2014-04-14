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
  this.stage = new PIXI.Stage(0x000000, true);

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

  // this.stage.click = goog.bind(this.onStageClick, this);



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
    this.getScene().createEntityComposition().one('RenderImage', 'RenderShape', 'RenderText', 'Camera').all('Transform')
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
  var sprite,                                             // the PIXI sprite object for this entity
      scene     = this.getScene(),                        // the CrunchJS Scene object in which this entity resides
      transf    = scene.getComponent(eId, 'Transform'),   // the transform component for this entity
      imgRenC   = scene.getComponent(eId, 'RenderImage'), // the RenderImage component for this entity (which it may not have)
      shapeRenC = scene.getComponent(eId, 'RenderShape'), // the RenderShape component for this entity (which it may not have)
      textRenC  = scene.getComponent(eId, 'RenderText'),  // the RenderText component for this entity (which it may not have)
      cameraC   = scene.getComponent(eId, 'Camera'),      // this entity's Camera component (which it may not have)
      screenSize = {}, offX,offY;
  // is this THE camera?
  if (cameraC != null && cameraC.isActive) {
    this.setCam(cameraC, eId);
  }
  
  // only proceed on entities which are visible
  if (imgRenC != null || shapeRenC != null || textRenC != null) {
    // count how many visible parts there are
    var parts = 0;
    if (imgRenC != null) {parts++;}
    if (shapeRenC != null) {parts++;}
    if (textRenC != null) {parts++;}

    // match to the PIXI sprite list
    if (this.sprites[eId] == undefined){ // no PIXI representation yet, so embark on creating new represenations
      if (parts == 1){ // only need to make the one sprite
        if (imgRenC != null) {
          sprite = new PIXI.Sprite( PIXI.Texture.fromImage(imgRenC.image) );
          sprite._entityId = eId;
          sprite.setInteractive(true);
          sprite.click = goog.bind(this.onStageClick, this);
        } else if (shapeRenC != null){  // shapeRendering requires more complex painting right now.
          sprite = this.makePIXIShape(shapeRenC, eId);
        } else {
          sprite = new PIXI.Text(textRenC.text, textRenC.style);
        }
        this.stage.addChild(sprite); // add the sprite to the PIXI stage
      } else {         // need to make an array of sprites [image, shape, text] in that order
        sprite = [];
        if (imgRenC != null) { // make the imageRendering sprite
          sprite[0] = new PIXI.Sprite( PIXI.Texture.fromImage(imgRenC.image) );
          this.stage.addChild(sprite[0]);  // add it to the stage          
          sprite[0]._entityId = eId;
          sprite[0].setInteractive(true);
          sprite[0].click = goog.bind(this.onStageClick, this);
        }
        if (shapeRenC != null) {
          sprite[1] = this.makePIXIShape(shapeRenC, eId);
        }
        if (textRenC != null) {
          sprite[2] = new PIXI.Text(textRenC.text, textRenC.style);
          this.stage.addChild(sprite[2]);  // add it to the stage
        }
      }
      this.sprites[eId] = sprite;   // add the sprite or sprite-list to the stage's sprite-list
    } else {  // already a PIXI representation (or array of them) exsists
      sprite = this.sprites[eId]; // access the sprite
      // if the PIXI representation is an array, and the entity has more than 1 part needed to render
      if (parts > 1 && goog.isArray(sprite)){
        // if the image component is on this entity, but the PIXI representation of it is not.
        // similar checks for the other 2 renderComponents
        if (sprite[0] == undefined && imgRenC != null) {
          sprite[0] = new PIXI.Sprite( PIXI.Texture.fromImage(imgRenC.image) );
          sprite[0]._entityId = eId;
          sprite[0].setInteractive(true);
          sprite[0].click = goog.bind(this.onStageClick, this);
          this.stage.addChild(sprite[0]);  // add it to the stage
        } else if (sprite[1] == undefined && shapeRenC != null) {
          sprite[1] = this.makePIXIShape(shapeRenC, eId);
        } else if (sprite[2] == undefined && textRenC != null) {
          sprite[2] = new PIXI.Text(textRenC.text, textRenC.style);
          this.stage.addChild(sprite[2]);  // add it to the stage
        }
        this.sprites[eId] = sprite;   // add the sprite or sprite-list to the stage's sprite-list, because it might have changed
      }
    }
    
    // aside from some array/object checking, here is where we start to actually process the entity

    // ensure that the sprite is an array/a sprite depending upon reality
    if (parts == 1){  // it should be a sprite
      if (Object.prototype.toString.call( sprite ) == '[object Array]'){ // but it is an array! oh noes!
        // we fix the issue by removing the PIXI representation of the renderables, and then returning.
        // this works, because the next frame, this very method will re-add the stuff it needs.
        for (var q = 0; q < sprite.length; q++){
          this.stage.removeChild(sprite[q]);
        }
        this.sprites[eId] = undefined;
        return;
      } else {        // and we found out that the sprite is what its supposed to be
        var xRenC;
        // handle the single renderable
        if (imgRenC != null) {            // it is a RenderImage PIXI.Sprite
          // first, deal with the sizing of the thing
          var size = this.getSize(eId, 'RenderImage');
          var bSize = {
            x: size.width,
            y: size.height
          };
          screenSize.width = this.translateScale(bSize, 'x');
          screenSize.height = this.translateScale(bSize, 'y');  
          xRenC = imgRenC;
        } else if (shapeRenC != null) {   // it is a RenderShape PIXI.Graphics
          // first, deal with the sizing of the thing
          var size = this.getSize(eId, 'RenderShape');
          var bSize = {
            x: size.width,
            y: size.height
          };
          screenSize.width = this.translateScale(bSize, 'x');
          screenSize.height = this.translateScale(bSize, 'y');  
          xRenC = shapeRenC;
          // check for changes
        } else {                          // it is a RenderText PIXI.Text
          // first, deal with the sizing of the thing
          var size = this.getSize(eId, 'RenderText');
          var bSize = {
            x: size.width,
            y: size.height
          };
          screenSize.width = this.translateScale(bSize, 'x');
          screenSize.height = this.translateScale(bSize, 'y');  
          xRenC = textRenC;
          // check for changes
        }
        // then access the offests
        offX = xRenC.offset.x;
        offY = xRenC.offset.y;
        // after handling PIXI representations of entity
        // (sprite => entity)
        ///////////////////////////////////
        // Do the actual visual updating //
        ///////////////////////////////////
        sprite = this.updateSprite(sprite, screenSize, offX, offY, transf);
      }
    } else {         // it should be an array
      if (Object.prototype.toString.call(sprite) != '[object Array]'){ // but it is not an array!!! oh noes!
        // fix by removing the PIXI representation of the renderable, and returning. will be re-made next frame.
        this.stage.removeChild(sprite); // remove from PIXI
        this.sprites[eId] = undefined;     // clear from self
        return;                            // we done
      } else {
        // handle the array of renderables
        for (var p = 0; p < 3; p++) {
          if(sprite[p] == undefined) {continue;}
          // first, deal with the sizing of the thing
          var cName;
          if(p==0){cName='RenderImage';offX=imgRenC.offset.x;offY=imgRenC.offset.y;}
          else if(p==1){cName='RenderShape';offX=shapeRenC.offset.x;offY=shapeRenC.offset.y;}
          else{cName='RenderText';offX=textRenC.offset.x;offY=textRenC.offset.y;}

          var size = this.getSize(eId, cName);
          var bSize = {
            x: size.width,
            y: size.height
          };
          screenSize.width = this.translateScale(bSize, 'x');
          screenSize.height = this.translateScale(bSize, 'y');  
          
          // check to handle size-change in renderShape
          if(cName == 'RenderShape'){
            var redraw = sprite[p].width != screenSize.width || sprite[p].height != screenSize.height;

            if(redraw){
              sprite[p].width = screenSize.width;
              sprite[p].height =  screenSize.height
              sprite[p].clear();
              if (shapeRenC.type.toLowerCase() == 'rectangle') {
                if(shapeRenC.fill === true){
                  sprite[p].beginFill(shapeRenC.color);
                }
                sprite[p].lineStyle(1, shapeRenC.color, 1);
                sprite[p].drawRect(0,0,screenSize.width, screenSize.height);//fill all the available space
              }
            }
          }
          if(cName == 'RenderText'){
            sprite[p].setText(textRenC.getText());
          }
          // actual visual updating
          sprite[p] = this.updateSprite(sprite[p], screenSize, offX, offY, transf);
        }
      }
    }
  }
};

CrunchJS.Systems.RenderingSystem.prototype.updateSprite = function(sprite, screenSize, offX, offY, transf){
  // offest the transform
  var temp = {};
  temp.x = transf.x + offX;
  temp.y = transf.y + offY;
  // translate the Transform position to the onscreen position
  var transformX = this.translatePosition(temp, 'x'),
      transformY = this.translatePosition(temp, 'y');

  // Get top left for rendering
  var left  = transformX - screenSize.width/2,
      right = transformY - screenSize.height/2;

  sprite.position.x = left;
  sprite.position.y = right;

  // translate the in-game object Size (Body or RenderImage) to the onscreen object size
  sprite.width  = screenSize.width;
  sprite.height =  screenSize.height

  return sprite;
};

// helper method for processEntity();
CrunchJS.Systems.RenderingSystem.prototype.makePIXIShape = function(shapeRenC, eId){
  var temp = new PIXI.Graphics();
  // deal with the sizing of the thing
  var size = this.getSize(eId, 'RenderShape');
  var bSize = {
    x: size.width,
    y: size.height
  };
  var useWidth = this.translateScale(bSize, 'x');
  var useHeight = this.translateScale(bSize, 'y');  
  // PIXI code for drawing rectangles
  if (shapeRenC.type.toLowerCase() == 'rectangle') {
    if(shapeRenC.fill === true){
      temp.beginFill(shapeRenC.color);
    }
    temp.lineStyle(1, shapeRenC.color, 1);
    temp.drawRect(0,0, useWidth,useHeight);//fill all the available space
  }
  this.stage.addChild(temp);  // add it to the stage
  return temp;
};

/**
  Takes the entity ID{id} and the string component name{componentName} in order to determine the size object from that rendering component
*/
CrunchJS.Systems.RenderingSystem.prototype.getSize = function(id, componentName) { 
  var body = this.getScene().getComponent(id, 'Body'),
    xRenC = this.getScene().getComponent(id, componentName),
    size = {};

  if(body && xRenC.size.x == -1 && xRenC.size.y == -1){
    size.width = body.getSize().width;
    size.height = body.getSize().height;
  }
  else if(xRenC.size.x != -1 && xRenC.size.y != -1){
    size.width = xRenC.size.x;
    size.height = xRenC.size.y;
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
  console.log("STAGE WAS CLICKED", data); 
  this.getScene().fireEvent('click', data);
};

CrunchJS.Systems.RenderingSystem.prototype.onMouseMove = function(data) {
  if(this.getViewport()){
    this.getViewport().setMousePosition({
      x : data.offsetX,
      y : data.offsetY
    });
  }
};

CrunchJS.Systems.RenderingSystem.prototype.entityDestroyed = function(eId) {
  goog.base(this, 'entityDestroyed', eId);
  if (Object.prototype.toString.call(this.sprites[eId]) == '[object Array]'){ // we're dealing with an array of PIXI objects
    for(var q=0; q<3; q++){
      if (this.sprites[eId][q] == undefined) continue;
      this.stage.removeChild(this.sprites[eId][q]); // remove from PIXI
    }
  } else { // we've only got the one PIXI object to clear
    this.stage.removeChild(this.sprites[eId]);
  }
  this.sprites[eId] = undefined; // clear the RenderingSystem version of the entity
};

CrunchJS.Systems.RenderingSystem.prototype.entityDisabled = function(eId) {
  goog.base(this, 'entityDisabled', eId);
  if (Object.prototype.toString.call(this.sprites[eId]) == '[object Array]'){ // we're dealing with an array of PIXI objects
    for(var q=0; q<3; q++){
      if (this.sprites[eId][q] == undefined) continue;
      this.stage.removeChild(this.sprites[eId][q]); // remove from PIXI
    }
  } else { // we've only got the one PIXI object to clear
    this.stage.removeChild(this.sprites[eId]);
  }
  this.sprites[eId] = undefined; // clear the RenderingSystem version of the entity
};
