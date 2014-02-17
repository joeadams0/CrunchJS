// From https://github.com/thanpolas/generator-closure

goog.provide('CrunchJS.Utils.vendor');


if (!COMPILED) {

  /**
   * EDIT THIS ARRAY.
   *
   * @type {Array} 
   */
  CrunchJS.Utils.vendor.files = [
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
  CrunchJS.Utils.vendor.loadDeps = function(deps) {
    for(var i = 0, len = deps.length; i < len; i++) {
      CrunchJS.Utils.vendor.writeScript(deps[i]);
    }
  };

  /**
   * Write script on document. This operation will get scripts synchronously.
   *
   * @param  {string} src A canonical path.
   * @param  {boolean=} optInline set to true to append inline javascript.
   */
  CrunchJS.Utils.vendor.writeScript = function (src, optInline) {
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
  CrunchJS.Utils.vendor.go = function(files) {

    var vendorFilepath = goog.basePath + goog.getPathFromDeps_('CrunchJS.Utils.vendor');

    var vendorFilename = vendorFilepath.match(/[\.\w]+$/)[0];

    var ind = vendorFilepath.indexOf(vendorFilename);

    var vendorPath = vendorFilepath.substr(0, ind);

    var newFiles = [];

    for (var i = 0, len = files.length; i < len; i++) {
      newFiles.push(vendorPath + '../../vendor/' + files[i]);
    }

    // load third party deps
    CrunchJS.Utils.vendor.loadDeps(newFiles);
  };
}
