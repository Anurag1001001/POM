Power of Music
=================

Backend Implementation in Nodejs.

Know before start
----------

Before you begin to develop, make sure you have known something about these:

0. JavaScript
0. [Node.js](http://nodejs.org/api/)
0. [Express](https://expressjs.com/): node.js web application framework
0. [Bookshelf](https://bookshelfjs.org/): node.js database ORM middleware
0. Relational Database: PostgreSQL


## Architecture ##

### Folder structure ###
```
src
    |-- index.js :   Application entry points
    │
    |-- api/      :  Application routes and controller
    │
    |-- config/   :  environment variables
    │
    |-- models/   :  contains all ORM models 
    │
    |-- services/  : Main business logic code as service layer
    |      |  |-- middleware/ : Interceptor filters before routers
    |      |  |-- bootstrap.js : Execution as server starts
    |      |  |-- database.js : Database definition
    |      |  |-- utils :       reusable templates and functions 
    │ 
    |-- subscriber/ : async task event handlers
    │
    |-- test/       : testing scripts
    │
    |-- views/      : contains view-templates

```


## Naming Conventions

 ### variables, properties and function names.
* use lowerCamelCase.
    - example:  ```var userToken = 'abcdefghijklmnopqrstuvwxyz'``` 

### constant
* use upperCamelCase for constant variable.
    - example:  ```const UserToken = 'abcdefghijklmnopqrstuvwxyz'``` 

### File Naming convention
* use lowercase separte words by dot(.).
    -  example:  ```feature.controller.js``` 

## Miscellaneous
