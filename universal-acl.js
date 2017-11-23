'user strict';

var pathToRegexp = require('path-to-regexp');

module.exports = class UniversalACL {

    /**
     * 
     * @param {object} adapter 
     */
    constructor(adapter) {
        this.adapter = adapter;
        this.rules = {};
        this.mapData = {};
        this.collectionId = '757365722d72756c6573';

        this.tables = {
            UniversalACL: "UniversalACL",
            UniversalACLRoles: "UniversalACLRoles",
            UniversalACLMapping: "UniversalACLMapping"
        }
    }

    /**
     * 
     * @param {object} db 
     */
    static mongoAdapter(db) {
        var MongoAdapter = require('./adapters/mongo-adapter');
        var MongoAdapter = new MongoAdapter(db);
        return MongoAdapter;
    }

    /**
     * 
     * @param {object} rules 
     */
    updateRules(rules) {
        this.rules = rules;
        this.adapter.update(this.tables.UniversalACL, this.collectionId, this.rules);
    }

    /**
     * 
     * @param {string} userId 
     * @param {[string]} roles 
     */
    addRoles(userId, roles) {
        this.adapter.addRoles(this.tables.UniversalACLRoles, userId, roles);
    }

    /**
     * 
     * @param {string} userId 
     * @param {[string]} roles 
     */
    removeRoles(userId, roles) {
        this.adapter.removeRoles(this.tables.UniversalACLRoles, userId, roles);
    }

    /**
     * 
     * @param {string} userId 
     * @param {[string]} roles 
     */
    modifyRoles(userId, roles) {
        this.adapter.modifyRoles(this.tables.UniversalACLRoles, userId, roles);
    }

    /**
     * 
     * @param {object} req 
     * @param {string} userId 
     * @param {function} callback 
     */
    isAllowed(req, userId, callback) {
        var adapter = this.adapter;
        var tables = this.tables;
        var mapData = this.mapData;

        var isAllowed = false;
        var effect = null;

        adapter.findRules(tables.UniversalACL, this.collectionId, function(err, rules) {
            if (err) {
                callback(err);
            } else {
                adapter.findRoles(tables.UniversalACLRoles, userId, function(err, user) {

                    if (err) {
                        callback(err);
                    } else {
                        for (var i = 0; i < user.roles.length; i++) {
                            effect = rules.roles[user.roles[i]].effect;

                            isAllowed = rules.roles[user.roles[i]].resources.some(function(resource) {
                                var methodMatched       = resource.permissions.some(x => x.toLowerCase() === req.method.toLowerCase() || x.toLowerCase() === '*');
                                var nameOrPathMatched   = false;

                                if(resource.name){
                                    if(mapData.mappings[resource.name]){
                                        nameOrPathMatched = pathToRegexp(mapData.mappings[resource.name]).test(req.url.split("?")[0])
                                    }
                                }
                                else{
                                    nameOrPathMatched = pathToRegexp(resource.action).test(req.url.split("?")[0]);
                                }
                                return methodMatched && nameOrPathMatched;
                            })

                            if (isAllowed) {
                                break;
                            }
                        }

                        if (effect === 'deny') {
                            callback(null, !isAllowed);
                        } else {
                            callback(null, isAllowed);
                        }
                    }
                })
            }
        })
    }
    
    /**
     * 
     * @param {[string]} roleNames 
     * @param {function} callback 
     */
    getRoles(roleNames, callback){
        this.adapter.getRoles(this.tables.UniversalACL, this.collectionId, roleNames, function(err, roles){
            if(err){
                callback(err);
            }
            else{
                callback(null, roles.roles);
            }
        })
    }

    /**
     * 
     * @param {[object]} mapData 
     */
    updateMapData(mapData) {
        this.mapData = mapData;
        this.adapter.update(this.tables.UniversalACLMapping, this.collectionId, this.mapData);
    }
}
