var //!
    colors = require('colors');

AggregateBase = function(aggregateType){
        // private instance members
        var //!
        domainEvents = [],
        id = null,
        appliedEvents = [],
        eventVersion = -1;
        
        // private instance methods
        
        // public instance members
        var self = this;
        self.aggregateType = aggregateType;
        
        // public instance methods
        self.getId = function(){
            return id;
        };

        self.setId = function(newId){
            id = newId;
        };

        self.register = function(eventName, handledBy){
            console.log(colors.yellow("register - " + eventName));
            domainEvents[eventName] = handledBy;
        };

        self.apply = function (domainEvent, callback) {
            domainEvent.aggregateId = id;
            domainEvent.version = ++eventVersion;
            domainEvent.aggregateType = self.aggregateType;
            console.log(colors.yellow("apply - " + domainEvent.eventName + " id: " + id + " version: " + eventVersion));
            domainEvents[domainEvent.eventName](domainEvent, function(err){
                if(!err){
                    appliedEvents.push(domainEvent);
                    callback(null);
                }else{
                    callback(err);
                }
            });
           
        };

        self.clear = function (callback) {
            console.log(colors.yellow("clear - id: " + id));
            appliedEvents = [];
            callback(null);
        };
        
        self.getChanges = function(callback){
            console.log(colors.yellow("getChanges - id: " + id + " changes: " + appliedEvents.length));
            var changes = appliedEvents.sort(function(lhs, rhs){
                    return lhs.version - rhs.version;
                });
            callback(null, changes);
        };
        
        self.loadFromStream = function(eventStream, callback){
            if(!eventStream) {
                callback(null, null);
            } else {
                console.log(colors.yellow("loadFromStream - id: " + id + " eventStream: " + eventStream.length));
                eventStream.forEach(function(domainEvent){
                    domainEvents[domainEvent.eventName](domainEvent, function(err){
                        if(err){
                            callback(err);
                        }
                    });
                });
                
                eventVersion = eventStream[eventStream.length -1].version;
                callback(null);
            }
        };
};

// public static methods
exports.AggregateBase = AggregateBase;