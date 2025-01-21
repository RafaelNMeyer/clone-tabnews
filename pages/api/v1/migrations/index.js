import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
});

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError({});
  console.error(publicError);
  response.status(publicError.status_code).json(publicError);
}

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });

    response.status(200).json(pendingMigrations);
  } catch (err) {
    const publicError = new InternalServerError({ cause: err });
    console.log(publicError);
    response.status(publicError.status_code).json(publicError);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0)
      response.status(201).json(migratedMigrations);

    response.status(200).json(migratedMigrations);
  } catch (err) {
    const publicError = new InternalServerError({ cause: err });
    console.log(publicError);
    response.status(publicError.status_code).json(publicError);
  } finally {
    await dbClient?.end();
  }
}
