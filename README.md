Instalar dependencias:

```sh
bun install
```

Iniciar base de datos:

```sh
bun run migrate
```

Cargar datos iniciales en la base de datos:

```sh
bun run seed
```

Se debe crear el archivo `.env` con el contenido de
`.env.example` y agregar los valores necesarios.

Iniciar el servidor de desarrollo:

```sh
bun run dev
```

Servidor iniciado en [localhost:3000](http://localhost:3000)
