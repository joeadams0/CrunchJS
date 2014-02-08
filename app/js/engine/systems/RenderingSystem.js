/**
 * The best rendering system ever made
 * @author Daniel Zapata
 */

goog.provide('CrunchJS.RenderingSystem');
goog.require('CrunchJS.System');

/**
 * Creates the Rendering System. If you're making a game, you probably need one of these.
 * @param {Object} canvasData Data about the canvas
 * @constructor
 * @class
 */
CrunchJS.RenderingSystem = function(canvasData){
  goog.base(this);
  // Configure PIXI usage
  this.stage = new PIXI.Stage(0xFFF0FF);
  this.renderer = new PIXI.autoDetectRenderer(
    (canvasData.width ? canvasData.width : 400),
    (canvasData.height ? canvasData.height : 400)
  );
  document.body.appendChild(this.renderer.view);
  this.sprites = []; // an array of Entities that are in the stage
};

goog.inherits(CrunchJS.RenderingSystem, CrunchJS.System);

CrunchJS.RenderingSystem.prototype.name = 'RenderingSystem';

CrunchJS.RenderingSystem.prototype.activate = function() {
  goog.base(this, 'activate');
  this.setEntityComposition(
    this.getScene().createEntityComposition().one('RenderImage', 'RenderShape').all('Transform')
  );
};

CrunchJS.RenderingSystem.prototype.process = function(f){
  goog.base(this, 'process');
  
  // the code that actually tries to re-draw to the Canvas
  var me = this;                    // explicit reference
  requestAnimFrame( function(){     // this is from JavaScript and prevents exceeding framerate
    me.renderer.render(me.stage);   // PIXI call to render the stage
  });
};

CrunchJS.RenderingSystem.prototype.processEntity = function(f, eId){
  // variable declarations
  var sprite,                                       // the PIXI sprite object for this entity
      scene = this.getScene(),                      // the CrunchJS Scene object in which this entity resides
      transf = scene.getComponent(eId, 'Transform'),// the transform component for this entity
      imgRenC,                                      // the RenderImage component for this entity
      shapeRenC                                     // the RenderShape component for this entity
      ;

  // Does the PIXI sprite list have a representation of this entity?
  if (this.sprites[eId] != undefined){
    sprite = this.sprites[eId];  // access the sprite
  } else {  // the entity has no PIXI representation, so we give it one
    // create the PIXI Sprite for this entity
    imgRenC = scene.getComponent(eId, 'RenderImage');
    shapeRenC = scene.getComponent(eId, 'RenderShape');
    if (imgRenC == null) {
      sprite = new PIXI.Sprite(  );
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
  sprite.position.x = transf.x;
  sprite.position.y = transf.y;
};
