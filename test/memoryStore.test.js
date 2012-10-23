var //!
	  should      = require('chai').should()
	, expect      = require('chai').expect
	, memoryStore = require('../lib/memoryStore')
	, AggregateBase = require('../lib/AggregateBase').AggregateBase;

describe('GIVEN an in memory event store', function(){
	describe('WHEN getting an event but not supplying an ID', function(){
		it('THEN returns an error', function(done){
			memoryStore.getById({}, function(err, data){
				err.should.equal("An ID should be supplied");
				expect(data).to.be.null;
				done();
			});
		});
	});

	describe('WHEN getting an event but not supplying an aggregate with a type', function(){
		it('THEN returns an error', function(done){
			memoryStore.getById({id: 123, obj: new AggregateBase()}, function(err, data){
				err.should.equal("The aggregate must have a valid type");
				expect(data).to.be.null;
				done();
			});
		});
	});	

	describe('WHEN getting an event for an non existing aggregate', function(){
		it('THEN returns null', function(done){
			memoryStore.getById({id: 123, obj: {aggregateType: 'test'}}, function(err, data){
				if(err) return done(err);
				expect(data).to.be.null;
				done();
			});
		});
	});
});