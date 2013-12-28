/**
 * @fileoverview third-party deps loader. Works only for devel env.
 */
goog.provide('Engine.Debug.vendor');


if (!COMPILED) {

  /**
   * EDIT THIS ARRAY.
   *
   * @type {Array} define the 3rd party deps.
   */
  Engine.Debug.vendor.files = [
    'jsworker-2.0.js'
  ];



  //
  //
  //
  // Nothing to see here, move on...
  //
  //

  /**
   * load third party dependencies.
   *
   * @param  {Array} deps key value, value being the url.
   */
  Engine.Debug.vendor.loadDeps = function(deps) {
    for(var i = 0, len = deps.length; i < len; i++) {
      Engine.Debug.vendor.writeScript(deps[i]);
    }
  };

  /**
   * Write script on document. This operation will get scripts synchronously.
   *
   * @param  {string} src A canonical path.
   * @param  {boolean=} optInline set to true to append inline javascript.
   */
  Engine.Debug.vendor.writeScript = function (src, optInline) {

    var out = '<script type="text/javascript"';
    if (!optInline) {
      out += ' src="' + src + '">';
    } else {
      out += '>' + src;
    }
    out += '</script>';
    document.write(out);
  };


  /**
   * Load vendor deps
   * @param {Array} files
   */
  Engine.Debug.vendor.go = function(files) {

    var vendorFilepath = goog.basePath + goog.getPathFromDeps_('Engine.Debug.vendor');

    var vendorFilename = vendorFilepath.match(/[\.\w]+$/)[0];

    var ind = vendorFilepath.indexOf(vendorFilename);

    var vendorPath = vendorFilepath.substr(0, ind);

    var newFiles = [];

    for (var i = 0, len = files.length; i < len; i++) {
      newFiles.push(vendorPath + '../vendor/' + files[i]);
    }

    // load third party deps
    Engine.Debug.vendor.loadDeps(newFiles);
  };

  Engine.Debug.vendor.go(Engine.Debug.vendor.files);
}
