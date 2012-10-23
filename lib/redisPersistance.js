var colors = require('colors'),
	redis = require("redis"),
    client = redis.createClient();

var saveEvent = function(domainEvent){
	var eventKey = domainEvent.aggregateId + ":" + domainEvent.aggregateType +":"+ domainEvent.eventName + ":" + domainEvent.version;
	console.log(colors.yellow("saveEvent - " + eventKey));
	client.set(eventKey, JSON.stringify(domainEvent));
	client.publish(eventKey, JSON.stringify(domainEvent));
};

exports.save = function(eventProvider, callback) {
	console.log(colors.yellow("save"));
	eventProvider.getChanges(function(err, events){
		events.forEach(saveEvent);
		callback(null);
	});
};

exports.getEvents = function(attributes, callback){
	var events = [],
		key = attributes.id + ":" + attributes.obj.aggregateType + ":*:*";

	console.log(colors.yellow("getEvents - key: " + key));
	client.keys(key, function(err, eventKeys){
		eventKeys.sort(function(a,b){
			// sort the keys so that they are in the correct event order
			var aVersion = a.substring(a.lastIndexOf(":") + 1, a.length);
			var bVersion = b.substring(b.lastIndexOf(":") + 1, b.length);
			return aVersion - bVersion;
		});

		client.mget(eventKeys, function(err, data){
			console.log(data);
			if(!data){
				callback("no data");
			} else {
				if(!data.length){
					callback(null, JSON.parse(data));
				} else {
					for (var i = data.length - 1; i >= 0; i--) {
						data[i] = JSON.parse(data[i]);
					}

					callback(null, data);	
				}
			}
		});
	});
};