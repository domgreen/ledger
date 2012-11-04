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

EntityBase = function(entityType){
        // private instance members
        var //!
        id = null,
        aggregateId = null,
        appliedEvents = [],
        versionProvider = null;
        
        // private instance methods
        
        // public instance members
        var self = this;
        extend(self, new EventEmitter2());
        self.entityType = entityType;

        // public instance methods
        self.getId = function(){
            return id;
        };

        self.setId = function(newId){
            id = newId;
        };

        self.setAggregateId = function(aggregateId){
            aggregateId = aggregateId;
        };

        self.setUpVersionProvider = function(provider){
            versionProvider = provider;
        };

        self.apply = function (domainEvent, callback) {
            domainEvent.entityId = id;
            domainEvent.aggregateId = aggregateId;
            domainEvent.version = versionProvider.get();
            
            console.log(colors.yellow("apply - " + domainEvent.eventName + " id: " + id + " version: " + eventVersion));
            
            self.emit(domainEvent.eventName, domainEvent);
            appliedEvents.push(domainEvent);
            callback(null);
        };

        self.clear = function (callback) {
            console.log(colors.yellow("clear - id: " + id));
            appliedEvents = [];
            callback(null);
        };

        self.getChanges = function(callback){
            console.log(colors.yellow("getChanges - id: " + id + " changes: " + appliedEvents.length));
            callback(null, appliedEvents);
        };
        
        self.loadFromStream = function(eventStream, callback){
            if(!eventStream) {
                callback(null, null);
            } else {
                console.log(colors.yellow("loadFromStream - id: " + id + " eventStream: " + eventStream.length));
                eventStream.forEach(function(domainEvent){
                    self.emit(domainEvent.eventName, domainEvent);
                });
                
                callback(null);
            }
        };
};

// public static methods
exports.EntityBase = EntityBase;