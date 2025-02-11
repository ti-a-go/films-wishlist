# Films wishlist


# How to run

Rename the `.env.example` file to `.env`

Start docker services:

```sh
docker compose up
```

## Run migrations:

Due to [this issue](https://github.com/typeorm/typeorm/issues/10537), TypeORM only runs with Node version 18.18.0.

To run the migrations user the `.tool-versions` file to set the correct node version.

If you don't have this node installed, please install.

Suggestion:

```sh
asdf install nodejs 18.18.0
```

```sh
asdf local nodejs 18.18.0
```

Then run the migraions


```sh
npm run typeorm migration:run
```

Now the app should be up and running.
