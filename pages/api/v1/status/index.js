import { createRouter } from "next-connect";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError({});
  response.status(publicError.status_code).json(publicError);
}

function onErrorHandler(err, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: err,
  });
  console.log(publicErrorObject);
  response.status(500).json(publicErrorObject);
}

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersion = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersion.rows[0].server_version;

  const maxConnections = await database.query("SHOW max_connections;");
  const maxConnectionsValue = maxConnections.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const activeConnections = await database.query({
    text: "SELECT count(*)::int from pg_stat_activity WHERE datname = $1; --AND state='active';",
    values: [dbName],
  });
  const activeConnectionsValue = activeConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    db_version: dbVersionValue,
    max_connections: parseInt(maxConnectionsValue),
    active_connections: activeConnectionsValue,
  });
}
