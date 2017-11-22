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
check if user is allowed to access a resource. Check the callback get get true false result.
#### Arguments
```
req     {Object}
userId  {String}
roles   {Function}
```
