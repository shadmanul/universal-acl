'user strict';

var pathToRegexp = require('path-to-regexp');

module.exports = class UniversalACL {
    
    /**
     * 
     * @param {object} adapter 
     */
    constructor(adapter) {
        this.adapter        = adapter;
        this.rules          = {};
        this.collectionId   = '757365722d72756c6573';

        this.tables = {
            UniversalACL: "UniversalACL",
            UniversalACLRoles: "UniversalACLRoles"
        }
    }

    /**
     * 
     * @param {object} db 
     */
    static mongoAdapter (db){
        var MongoAdapter = require('./adapters/mongo-adapter');
        var MongoAdapter = new MongoAdapter(db);
        return MongoAdapter;
    }

    /**
     * 
     * @param {object} rules 
     */
    updateRules (rules) {
        this.rules = rules;
        var adapter = this.adapter;
        adapter.updateRules(this.tables.UniversalACL, this.collectionId, this.rules);
    }

    /**
     * 
     * @param {string} userId 
     * @param {[string]} roles 
     */
    addRoles (userId, roles) {
        var adapter = this.adapter;

        adapter.addRoles (this.tables.UniversalACLRoles, userId, roles);
    }

    /**
     * 
     * @param {string} userId 
     * @param {[string]} roles 
     */
    removeRoles (userId, roles){
        var adapter = this.adapter;

        adapter.removeRoles(this.tables.UniversalACLRoles, userId, roles);
    }

    /**
     * 
     * @param {string} userId 
     * @param {[string]} roles 
     */
    modifyRoles (userId, roles){
        var adapter = this.adapter;

        adapter.modifyRoles(this.tables.UniversalACLRoles, userId, roles);
    }

    /**
     * 
     * @param {object} req 
     * @param {string} userId 
     * @param {function} callback 
     */
    isAllowed (req, userId, callback) {
        var adapter = this.adapter;
        var rules = this.rules;
        
        var isAllowed = false;
        var effect = null;

        adapter.findRoles(this.tables.UniversalACLRoles, userId, function(err, user){

            for (var i = 0; i < user.roles.length; i++) {
                effect = rules.roles[user.roles[i]].effect;

                isAllowed = rules.roles[user.roles[i]].resources.some(function(resource) {
                    return resource.permissions.some(x => x.toLowerCase() === req.method.toLowerCase() || x.toLowerCase() === '*') &&
                        pathToRegexp(resource.action).test(req.url.split("?")[0]);
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

        })
    }
}
