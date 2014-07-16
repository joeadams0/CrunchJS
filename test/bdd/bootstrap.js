
goog.provide('CrunchJS.test.bootstrap');

// setup mocha
mocha.ui('bdd');
mocha.reporter('html');

var should = chai.should(),
    expect = chai.expect;


goog.require('CrunchJS.test.World');
