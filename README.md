# Oclize

## Structure
### client
The angular / nativescript web + ios + android application.

### server
The nestjs server

## Development
Standard run:
```
SERVER_PORT=3000 docker-compose up
```

When a new node module was installed:
```
SERVER_PORT=3000 docker-compose up --build -V
```


Connect to db:
```
docker exec -it <container_id>  mongo admin -u root -p rootpassword
```

Add admin to db:
```
use oclize
db.createUser({ user: "admin", pwd: "password", roles: [ "readWrite" ]})
```

## Test
```
SERVER_PORT=3000 docker-compose run --rm server yarn test:watchAll
```
