# Oclize

## Structure
### client
The angular / nativescript web + ios + android application.

### server
The nestjs server

## Development
```
SERVER_PORT=3000 docker-compose up
```

## Test
```
SERVER_PORT=3000 docker-compose run --rm server yarn test:watchAll
```
