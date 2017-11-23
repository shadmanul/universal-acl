'use strict'

module.exports = class MongoAdapter {

    constructor(db) {
        this.db = db;
    }

    update(tableName, id, data) {

        this.db.collection(tableName, function(err, Collection) {
            Collection.update({
                _id: id
            }, data, {
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

                return null;
            })
            .catch(function(err){
                callback(err)

                return null;
            })
        });
        
    }

    findRules (tableName, id, callback){

        this.db.collection(tableName, function(err, Collection) {
            Collection.findOne({ _id: id })
            .then(function(rules){
                callback(null, rules);

                return null;
            })
            .catch(function(err){
                callback(err)

                return null;
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
                
                return null;
            })
            .catch(function(err){
                callback(err)
                
                return null;
            })
        })

    }
}