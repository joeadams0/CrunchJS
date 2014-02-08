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
  
  var rend = this.renderer;
  var stag = this.stage;
  requestAnimFrame( function(){
    rend.render(stag);
  });
};

CrunchJS.RenderingSystem.prototype.processEntity = function(f, eId){
  if(this.sprites.indexOf(eId) == -1){ // if the entity isn't in the stage
    var scene = this.getScene();
    var sprite = new PIXI.Sprite(PIXI.Texture.fromImage(scene.getComponent(eId, 'RenderImage').image));
    var transf = scene.getComponent(eId, 'Transform');

    sprite.position.x = transf.x;
    sprite.position.y = transf.y;

    this.stage.addChild(sprite);
    this.sprites.push(eId);
    
    console.log(this.stage.children);
  }
};
