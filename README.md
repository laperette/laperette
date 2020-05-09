## Install

```sh
yarn install
```

## Start local development services:

```sh
docker-compose up
```

This command will start 3 services:

- app_db: a postgre sql database, accesssible on the local host at `postgres://postgres:postgres@localhost:5430/laperette`
- app_server: the node server, started with nodemon
- app_client: the react app, started with react-scripts

## Run migrations

```sh
docker-compose run app_server yarn server migrate
```
