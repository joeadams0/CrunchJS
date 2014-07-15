/**
 * @author Joe Adams
 * @namespace CrunchJS.Network.Channel
 * @description This namespace contains all objects for making connections to other engines.
 */


goog.provide('CrunchJS.Network.Channel.IChannel');

/**
 * The Channel Interface
 * @interface
 * @class The Channel Interface
 */
CrunchJS.Network.Channel.IChannel = function() {};

/**
 * Posts an event through the channel
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
CrunchJS.Network.Channel.IChannel.prototype.postEvent = function(eventName, data) {};


/**
 * Listens for an event through the channel. You should overwrite this property
 * @param  {string} eventName The Event name
 * @param  {Object} data   The data to pass
 */
CrunchJS.Network.Channel.IChannel.prototype.onEvent = function(eventName, data) {};
