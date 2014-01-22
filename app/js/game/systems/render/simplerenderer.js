/**
 * @author Joe Adams
 */

goog.provide('Moba.SimpleRenderer');

goog.require('goog.dom');

/**
 * Constructs the simple Renderer
 * @constructor
 * @class A Simple Renderer
 */
Moba.SimpleRenderer = function() {
	this.template = 'Current Number: ';

	var newHeader = goog.dom.createDom('h1', {'style': 'background-color:#EEE'},
    'Hello, this is a simple renderer!');

    this.display = goog.dom.createDom('h2', {'style': 'background-color:#AAA'}, this.template);


  	goog.dom.appendChild(document.body, newHeader);
  	goog.dom.appendChild(document.body, this.display);

};

/**
 * Update the display
 * @param  {Engine.Frame} frame The current frame
 */
Moba.SimpleRenderer.prototype.update = function(frame) {
	var entities = Engine.engine.findEntities('renderable');
	if(entities.length >0)
		this.display.innerHTML=this.template + Engine.engine.getComponent(entities[0]._id, 'renderable').count;
};