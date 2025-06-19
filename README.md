# Films wishlist :movie_camera:

REST API to help you manage the films you wanna watch or watched. Also rate and recommend (or not) the films you already watched.

# How to run

## Environment Variables (`.env` file)

Rename the `.env.example` file to `.env`:

```sh
cp .env.example .env
```

Development: start docker services (API and Database):

```sh
npm run start
```

## Run migrations:

### Node version to run the migrations

Due to [this issue](https://github.com/typeorm/typeorm/issues/10537), TypeORM only runs with Node version 18.18.0.

To run the migrations use the `.tool-versions` file to set the correct node version.

If you don't have this node installed, please install.

### Installing NodeJS using [asdf](https://asdf-vm.com/guide/getting-started.html):

```sh
asdf install nodejs 18.18.0
```

```sh
asdf set local nodejs 18.18.0
asdf set nodejs 18.18.0
```

### Installing using [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

## Database hostname (`.env` file):

```sh
# In the '.env' file, change the value of the DATABASE_HOST environment variable from this:
DATABASE_HOST=films-wishlist-db

# To this:
DATABASE_HOST=localhojst

# Revert this after run the migrations.
```

## Now run the migraions:

```sh
npm run typeorm migration:run
```

### Upgrade node version

```sh
asdf set local nodejs 20.0.0
asdf set nodejs 20.0.0
```

### Restart the application

Kill the shell and run:

```sh
npm run start
```

## Swagger

We can see the endpoints documentation at `/api`:

[http://localhost:3000/api](http://localhost:3000/api)

<img src="./docs/images/swagger.png" width="500">

## Run test

Unit tests:

```sh
npm run test
```

Integration tests

```sh
npm run test:integration
```
