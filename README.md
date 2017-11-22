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
```javascript
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
        ]
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
```javascript
effect      {String}    [allow/deny] if allowed then user can access listed resources.
                        if denied then user can not access listed resources.
resources   {Array}
action      {String}    url path
                        examples: 
                        /:foo+ (one or more parameter matches)
                        /:foo* (zero or more parameter matches)
                        /:foo/(.*) (unnamed parameter)
permission  {Array}     url methods and use * to allow or deny all methods
option      {Object}    resource attributes
```

## addRoles (userId, roles) 
add new roles to a user
#### Arguments
```javascript
userId  {String}
roles   {Array}
```

## removeRoles (userId, roles)
remove roles from a user
#### Arguments
```javascript
userId  {String}
roles   {Array}
```

## modifyRoles (userId, roles)
replace existing roles and add new roles to user
#### Arguments
```javascript
userId  {String}
roles   {Array}
```

## isAllowed (req, userId, callback)
check if user is allowed to access a resource. Check the callback get get true false result. in the middleware check isAllowed. if isAllowed false send an error response
#### Arguments
```javascript
req      {Object}   {method: "GET", url: "/api/foo"}
userId   {String}
callback {Function}
```
