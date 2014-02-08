/**
 * @fileoverview third-party deps loader. Works only for devel env.
 */
goog.provide('CrunchJS.vendor');


if (!COMPILED) {

  /**
   * EDIT THIS ARRAY.
   *
   * @type {Array} define the 3rd party deps.
   */
  CrunchJS.vendor.files = [
    'pixi.js'
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
  CrunchJS.vendor.loadDeps = function(deps) {
    for(var i = 0, len = deps.length; i < len; i++) {
      CrunchJS.vendor.writeScript(deps[i]);
    }
  };

  /**
   * Write script on document. This operation will get scripts synchronously.
   *
   * @param  {string} src A canonical path.
   * @param  {boolean=} optInline set to true to append inline javascript.
   */
  CrunchJS.vendor.writeScript = function (src, optInline) {
    if(CrunchJS.world.isSim()){
      importScripts(src);
    }
    else{
      var out = '<script type="text/javascript"';
      if (!optInline) {
        out += ' src="' + src + '">';
      } else {
        out += '>' + src;
      }
      out += '</script>';
      document.write(out);
    }
  };

  /**
   * Load vendor deps
   * @param {Array} files
   */
  CrunchJS.vendor.go = function(files) {

    var vendorFilepath = goog.basePath + goog.getPathFromDeps_('CrunchJS.vendor');

    var vendorFilename = vendorFilepath.match(/[\.\w]+$/)[0];

    var ind = vendorFilepath.indexOf(vendorFilename);

    var vendorPath = vendorFilepath.substr(0, ind);

    var newFiles = [];

    for (var i = 0, len = files.length; i < len; i++) {
      newFiles.push(vendorPath + '../../vendor/' + files[i]);
    }

    // load third party deps
    CrunchJS.vendor.loadDeps(newFiles);
  };
}