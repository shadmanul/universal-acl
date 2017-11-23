'use strict'

module.exports = class MongoAdapter {

    constructor(db) {
        this.db = db;
    }

    updateRules(tableName, id, rules) {

        this.db.collection(tableName, function(err, Collection) {
            Collection.update({
                _id: id
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

        this.db.collection(tableName, function(err, Collection) {
            Collection.findOne({ _id: userId })
            .then(function(user){
                callback(null, user);
            })
            .catch(function(err){
                callback(err)
            })
        });
        
    }

    findRules (tableName, id, callback){

        this.db.collection(tableName, function(err, Collection) {
            Collection.findOne({ _id: id })
            .then(function(rules){
                callback(null, rules);
            })
            .catch(function(err){
                callback(err)
            })
        })

    }

    getRoles (tableName, id, roleNames, callback){

        var select = [];
        
        for(var key in roleNames){
            select.push({ ["roles." + roleNames[key]]: 1 });
        }

        select = Object.assign({}, ...select);

        this.db.collection(tableName, function(err, Collection) {
            Collection.findOne({ _id: id }, select)
            .then(function(rules){
                callback(null, rules);
            })
            .catch(function(err){
                callback(err)
            })
        })

    }
}