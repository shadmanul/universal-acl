'use strict'

module.exports = class MongoAdapter {

    constructor(db) {
        this.db = db;
    }

    updateRules(tableName, collectionId, rules) {

        this.db.collection(tableName, function(err, Collection) {
            Collection.update({
                _id: collectionId
            }, rules, {
                upsert: true
            });
        });

    }

    modifyRoles(tableName, userId, roles) {

        this.db.collection(tableName, function(err, Collection) {
            Collection.update({
                _id: userId
            }, {
                roles: roles
            }, {
                upsert: true
            });
        });

    }

    addRoles(tableName, userId, roles) {

        this.db.collection(tableName, function(err, Collection) {
            Collection.update({
                _id: userId
            }, {
                $addToSet: {
                    roles: {
                        $each: roles
                    }
                }
            }, {
                upsert: true
            });
        });

    }

    removeRoles(tableName, userId, roles) {

        this.db.collection(tableName, function(err, Collection) {
            Collection.update({
                _id: userId
            }, {
                $pull: {
                    roles: {
                        $in: roles
                    }
                }
            }, {
                upsert: true
            });
        });

    }

    findRoles (tableName, userId, callback){

        this.db.collection(tableName, function(err, UniversalACLRoles) {
            UniversalACLRoles.findOne({ _id: userId })
            .then(function(user){
                callback(null, user);
            })
            .catch(function(err){
                callback(err)
            })
        });
        
    }
}