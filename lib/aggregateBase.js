var //!
  EventEmitter2 = require('eventemitter2').EventEmitter2,
  colors = require('colors');

var extend = function (target, source) {
        var name, value, undef, i = 1,
            len = arguments.length;

        while (i < len) {
            source = arguments[i];
            for (name in source) {
                value = source[name];
                if (value !== undef) {
                    target[name] = value;
                }
            }
            i++;
        }
        return target;
    };

AggregateBase = function (aggregateType) {
    // private instance members
    var //!
        id = null,
        domainEvents = [],
        appliedEvents = [],
        childEntities = [];

    // private instance methods
    // public instance members
    var self = this;
    extend(self, new EventEmitter2());
    self.aggregateType = aggregateType;

    // public instance methods
    self.getId = function () {
        return id;
    };

    self.setId = function (newId) {
        id = newId;
    };

    self.eventVersion = (function(){
        var eventVersion = -1;
        
        return {
            get: function(){
                return ++eventVersion;
            },
            set: function(version){
                eventVersion = version;
            }
        };
    }());

    self.apply = function (domainEvent, callback) {
        domainEvent.aggregateId = id;
        domainEvent.version = self.eventVersion.get();
        domainEvent.aggregateType = self.aggregateType;
        
        console.log(colors.yellow("apply - " + domainEvent.eventName + " id: " + id + " version: " + domainEvent.version));
        
        self.emit(domainEvent.eventName, domainEvent);
        appliedEvents.push(domainEvent);
        callback(null);

        // domainEvents[domainEvent.eventName](domainEvent, function (err) {
        //     if(err) return callback(err);

        //     appliedEvents.push(domainEvent);
        //     callback(null);
        // });

    };

    self.clear = function (callback) {
        console.log(colors.yellow("clear - id: " + id));
        appliedEvents = [];

        childEntities.forEach(function (childEntity) {
            childEntity.clear(function (err) {
                if(err) return callback(err);
            });
        });

        callback(null);
    };

    self.getChanges = function (callback) {
        console.log(colors.yellow("getChanges - id: " + id));

        var events = appliedEvents;
        childEntities.forEach(function (childEntity) {
            childEntity.getChanges(function (err, data) {
                events.concat(data);
            });
        });

        var changes = events.sort(function (lhs, rhs) {
            return lhs.version - rhs.version;
        });
        callback(null, changes);
    };

    self.loadFromStream = function (eventStream, callback) {
        if(!eventStream) {
            callback(null, null);
        } else {
            console.log(colors.yellow("loadFromStream - id: " + id + " eventStream: " + eventStream.length));
            eventStream.forEach(function (domainEvent) {
                self.emit(domainEvent.eventName, domainEvent);

                // domainEvents[domainEvent.eventName](domainEvent, function (err) {
                //     if(err) {
                //         callback(err);
                //     }
                // });
            });

            self.eventVersion.set(eventStream[eventStream.length - 1].version);
            callback(null);
        }
    };

    self.registerChildEntity = function (entity, callback) {
        console.log("registerChildEntity: " + entity + " id: " + entity.getId());
        entity.setUpVersionProvider(self.eventVersion);
        childEntities.push(entity);
        if(callback) return callback(null);
    };
};

// public static methods
exports.AggregateBase = AggregateBase;