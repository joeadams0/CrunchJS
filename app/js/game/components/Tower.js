/**
 * @author  Joe Adams
 */

goog.provide('CloseContact.Components.Tower');

goog.require('CrunchJS.Component');

goog.require('goog.object');
/**
 * The Tower Component has the basic data about the state of the actor, ie health armor ect.
 * @param {[type]} params [description]
 * @constructor
 * @class 
 */
CloseContact.Components.Tower = function(params) {
	goog.base(this, params);

};

goog.inherits(CloseContact.Components.Tower, CrunchJS.Component);

CloseContact.Components.Tower.prototype.name = "Tower";