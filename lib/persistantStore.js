var colors = require('colors'),
	memoryStore = require('./memoryStore'),
	redisPersistance = require('./redisPersistance'),
    eventProviders = [];

var registerForTracking = function(aggregate, callback){
	console.log(colors.yellow("registerForTracking - id:" + aggregate.getId()));
	eventProviders.push(aggregate);
	memoryStore.add(aggregate, function(err){
		callback(null);
	});
};
exports.registerForTracking = registerForTracking;

exports.add = function (aggregate, callback) {
	console.log(colors.yellow("add - id:" + aggregate.getId()));
	registerForTracking(aggregate, function(err){
		if(!err){
			callback(null);
		}
	});
};

exports.commit = function(callback){
	console.log(colors.yellow("commit"));
	eventProviders.forEach(function(eventProvider){
		redisPersistance.save(eventProvider, function(err){
			if(!err){
				eventProvider.clear(function(err){
					if(err){
						callback(err);
					}
				});
			}
		});
	});

	eventProviders = [];
	callback(null);
};

exports.getById = function(attributes, callback){
	console.log(colors.yellow("getById - id:" + attributes.id));
	redisPersistance.getEvents(attributes, function(err, events){
		if(err){
			callback(err);
		}else{
			var aggregate = attributes.obj;
			aggregate.id = attributes.id;
			aggregate.loadFromStream(events, function(err){
				if(!err){
					registerForTracking(aggregate, function(err){
						if(!err){
							callback(null, aggregate);
						}
					});
				}
			});
		}
	});
};