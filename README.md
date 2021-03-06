# universal-acl
an access control module for all web apps

# Initialization
pass db instance. currenly it supports only mongodb
```javascript
UniversalACL = new UniversalACL(UniversalACL.mongoAdapter(db));
```

# Methods
## updateMapData(mapData)
update map data. here in mapData object you have provide name for actions.
#### Arguments
```
mapData   {object}
```
#### mapping.json
```javascript
{
    "mappings": {
        "ExtendedUser:findById": "/api/ExtendedUsers/:id",
        "ExtendedUser:list": "/api/ExtendedUsers/:id",
        "ExtendedUser:login": "/api/ExtendedUsers/login",
        "ExtendedUser:create": "/api/ExtendedUsers"
    }
}
```
you can say inside mappings object, keys are synonyms for actions.

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
                "permissions": ["POST"]
            },
            {
                "name": "ExtendedUser:create",
                "permissions": ["POST"]
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
            "permissions": ["GET"]
        }]
    }
}
```
#### Arguments
```
effect      {String}    [allow/deny] if allowed then user can access listed resources.
                        if denied then user can not access listed resources.
resources   {Array}
name        {String}    action name. but to use name you have to update map data.
action      {String}    url paths. not necessary if name is provided.
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
check if user is allowed to access a resource. Check the callback to get true false result. in the middleware check isAllowed. if isAllowed false send an error response
#### Arguments
```
req      {Object}   {method: "GET", url: "/api/foo"}
userId   {String}
callback {Function}
```
#### Example
```javascript
UniversalACL.isAllowed(req, userId, function(err, isAllowed) {
    if (isAllowed) {
        next();
    } else {
        var error = new Error();
        error.status = 401;
        error.message = 'You need to be authenticated to access this endpoint';
        next(error);
    }
})
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

## addRoleToRules(filePath)
add a role to existing rules using a json file
#### Arguments
```
filePath    {String}    example: path.resolve(__dirname, '../lib/acl/acl-roles/superadmin.json')
```
#### superadmin.json
```javascript
{
    "superadmin": {
        "effect": "deny",
        "resources": []
    }
}
```