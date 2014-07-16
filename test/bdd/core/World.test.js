goog.provide('CrunchJS.test.World');



describe('CrunchJS.World', function(){

    describe('Constructor', function(){

        it('should have a constructor', function () {
            chai.expect(CrunchJS.World).to.be.a('function');
        });
    });

    describe('Run Method', function(){
        it('should have a run method', function () {
            var world = new CrunchJS.World();
            chai.expect(world.run).to.be.a('function');
        });

        it('should start the engine', function(){
            var world = new CrunchJS.World();
            world.run();

            world.isRunning().should.be.true;
        });
    });

    describe('Pause Method', function() {
        it('should have a pause method', function () {
            var world = new CrunchJS.World();
            chai.expect(world.pause).to.be.a('function');
        });

        it('should pause the engine', function(){
            var world = new CrunchJS.World();
            world.pause();
            world.isRunning().should.be.false;
        });
    });

    it('should have a step method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.step).to.be.a('function');
    });

    it('should have an isRunning', function(){
        var world = new CrunchJS.World();
        chai.expect(world.isRunning).to.be.a('function');
    });

    it('should have an addScene method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.addScene).to.be.a('function');
    });

    it('should have a removeScene method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.removeScene).to.be.a('function');
    });

    it('should have a getScene method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.getScene).to.be.a('function');
    });

    it('should have a transitionScene method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.transitionScene).to.be.a('function');
    });

    it('should have a getCurrentScene method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.getCurrentScene).to.be.a('function');
    });

    it('should have a fireEvent method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.fireEvent).to.be.a('function');
    });

    it('should have a log method', function(){
        var world = new CrunchJS.World();
        chai.expect(world.log).to.be.a('function');
    });
});