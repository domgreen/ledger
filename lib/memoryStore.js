var colors = require('colors'),
	aggregatesInMemory = {};

exports.clearAggregates = function(){
	aggregatesInMemory = {};
};

exports.getById = function (attributes, callback) {
	if(!attributes.id) {
		return callback("An ID should be supplied", null);
	}

	if(!attributes.obj.aggregateType) {
		return callback("The aggregate must have a valid type", null);
	}

	if(!aggregatesInMemory[attributes.obj.aggregateType]) {
		callback(null, null);
	} else {
		callback(null, aggregatesInMemory[attributes.obj.aggregateType][attributes.id]);
	}
};

exports.add = function (aggregate, callback) {
	var type = aggregate.aggregateType;
	if(!aggregatesInMemory[type]) {
		aggregatesInMemory[type] = {};
	}

	if(!aggregatesInMemory[type][aggregate.getId()]) {
		aggregatesInMemory[type][aggregate.getId()] = aggregate;
	}

	callback(null);
};