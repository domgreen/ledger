var //!
	colors = require('colors'),
	memoryStore = require('./memoryStore'),
	persistantStore = require('./persistantStore');

exports.getById = function(attributes, callback){
	console.log(colors.yellow("getById - id: " + attributes.id));
	memoryStore.getById(attributes, function(err, aggregate){
		if(!err){
			console.log("no error");
			if(!aggregate){
				persistantStore.getById(attributes, function(err, aggregate){
					if(err){
						callback(err);
					}else{
						callback(null, aggregate);
					}
				});
			}else{
				persistantStore.registerForTracking(aggregate, function(err){
					if(!err){
						callback(null, aggregate);
					}
				});
			}
		}
	});
};

exports.addEvent = function (aggregate, callback) {
	console.log(colors.yellow("add - id: " + aggregate.getId()));
	persistantStore.add(aggregate, function(err){
		if(!err){
			persistantStore.commit(function(err){
				if(!err){
					callback(null);
				}
			});
		}
	});
};

exports.commit = function (callback){
	console.log(colors.yellow("commit"));
	persistantStore.commit(callback);
};