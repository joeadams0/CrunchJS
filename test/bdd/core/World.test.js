goog.provide('CrunchJS.test.World');

var world = new CrunchJS.World();

describe('CrunchJS.World', function(){
   it('should have a constructor', function(){
       chai.expect(CrunchJS.World).to.be.a('function');
   });

    it('should have a run method', function() {
        chai.expect( world.run ).to.be.a('function');
    });

    it('should have a pause method', function(){
        chai.expect(world.pause).to.be.a('function');
    });

    it('should have a step method', function(){
        chai.expect(world.step).to.be.a('function');
    });
});