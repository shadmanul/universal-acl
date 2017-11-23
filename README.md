# universal-acl
an access control module for all web apps

# Initialization
pass db instance. currenly it supports only mongodb
```javascript
UniversalACL = new UniversalACL(UniversalACL.mongoAdapter(db));
```

# Methods
## updateRules (rules)
add / update set of rules. Below see the example of rules object 
#### Arguments
```
rules   {object}
```
#### rules.json
```javascript
{
    "guest": {
        "effect": "allow",
        "resources": [{
                "action": "/api/ExtendedUsers/login",
                "permissions": ["POST"],
                "options": {}
            },
            {
                "action": "/api/ExtendedUsers",
                "permissions": ["POST"],
                "options": {}
            }
        ],
        "privileges": [{
            "action": "/api/ExtendedUsers/:id",
            "options": {
                "DELETE_BUTTON": false,
                "EDIT_BUTTON": false
            }
        }]
    },
    "admin": {
        "effect": "deny",
        "resources": [{
            "action": "/api/ExtendedUsers",
            "permissions": ["GET"],
            "options": {}
        }]
    }
}
```
#### Arguments
```
effect      {String}    [allow/deny] if allowed then user can access listed resources.
                        if denied then user can not access listed resources.
resources   {Array}
action      {String}    url paths.
                        examples: 
                        /api/Products/:id+ (one or more parameter matches)
                        /api/Products/:id* (zero or more parameter matches)
                        /api/Products/(.*)* (includes products & its childs)
                        /api/Products/(.*) (excludes products but includes its childs)
permission  {Array}     url methods and use * to allow or deny all methods.
privileges  {Array}     list of privileges for listed resources.  
options     {Object}    resource attributes.
```

## addRoles (userId, roles) 
add new roles to a user
#### Arguments
```
userId  {String}
roles   {Array}
```

## removeRoles (userId, roles)
remove roles from a user
#### Arguments
```
userId  {String}
roles   {Array}
```

## modifyRoles (userId, roles)
replace existing roles and add new roles to user
#### Arguments
```
userId  {String}
roles   {Array}
```

## isAllowed (req, userId, callback)
check if user is allowed to access a resource. Check the callback get get true false result. in the middleware check isAllowed. if isAllowed false send an error response
#### Arguments
```
req      {Object}   {method: "GET", url: "/api/foo"}
userId   {String}
callback {Function}
```

## getRoles (roleNames, callback)
get role definitions.
#### Arguments
```
roleNames   {String}    example: ["member", "admin"]
callback    {Function}
```
#### Example
```javascript
router.get('/api/universalACL/roles', function(req, res, next) {
    var roleNames = JSON.parse(req.query.roleNames);
    UniversalACL.getRoles( roleNames, function(err, roles){
        if(err){
            next(err);
        }
        else{
            res.send(roles);
        }
    })
});
```