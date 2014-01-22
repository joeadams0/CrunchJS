/**
 * @author Joe Adams
 */

goog.provide('ExampleSystem');

/**
 * Constructs the Example System
 * @constructor
 * @class A Simple Example System
 */
ExampleSystem = function() {

};

ExampleSystem.prototype.update = function(frame) {
	var engine = Engine.engine;
	var ents = engine.findEntities('renderable');
	if(frame.id%5 ==0){
		//throw JSON.stringify("Ents: "+ents);

		engine.mainChannel.postEvent('message', "Simple System Update: "+frame.id+", Entity Count: "+ents.length);

		if(ents.length>0){
			var comp = engine.getComponent(ents[0]._id, 'renderable');
			comp.count++;
		}
	}
};

ExampleSystem.prototype.__identifier = 'ExampleSystem';