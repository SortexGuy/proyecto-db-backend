To install dependencies:
```sh
bun install
```

To initialize the database:
```sh
bun run migrate
```

To load some testing data to the db:
```sh
bun run seed
```

You have to create a `.env` file with the content
of `.env.example` and fill in the values
with random characters to test.

To run the dev server:
```sh
bun run dev
```

Server starts on [localhost:3000](http://localhost:3000)
