/**
 * @author Joe Adams
 */

goog.provide('CloseContact.Components.FoWComponent');

goog.require('CrunchJS.Component');

/** 
 * Creates a component to attack another entity	
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.FoWComponent = function(params) {
	goog.base(this, params);

	if(!params)
		params = {};
	
	this.highlightedEntities = params.highlightedEntities ? params.highlightedEntities : [];
};

goog.inherits(CloseContact.Components.FoWComponent, CrunchJS.Component);

CloseContact.Components.FoWComponent.prototype.name = 'FoWComponent';


CloseContact.Components.FoWComponent.prototype.getHighlightedEntities = function() {
	return this.highlightedEntities;
};

