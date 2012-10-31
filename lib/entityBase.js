var //!
    colors = require('colors');

EntityBase = function(entityType){
        // private instance members
        var //!
        id = null,
        domainEvents = [],
        appliedEvents = [],
        versionProvider = null;
        
        // private instance methods
        
        // public instance members
        var self = this;
        self.entityType = entityType;

        // public instance methods
        self.getId = function(){
            return id;
        };

        self.setId = function(newId){
            id = newId;
        };

        self.setUpVersionProvider = function(provider){
            versionProvider = provider;
        };

        self.register = function(eventName, handledBy){
            console.log(colors.yellow("register - " + eventName));
            domainEvents[eventName] = handledBy;
        };

        self.apply = function (domainEvent, callback) {
            domainEvent.aggregateId = id;
            domainEvent.version = versionProvider.get();
            console.log(colors.yellow("apply - " + domainEvent.eventName + " id: " + id + " version: " + eventVersion));
            domainEvents[domainEvent.eventName](domainEvent, function(err){
                if(err) return callback(err);

                appliedEvents.push(domainEvent);
                callback(null);
            });
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
                    domainEvents[domainEvent.eventName](domainEvent, function(err){
                        if(err) return callback(err);
                    });
                });
                
                callback(null);
            }
        };
};

// public static methods
exports.EntityBase = EntityBase;