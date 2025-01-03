import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
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
  } catch (err) {
    const publicErrorObject = new InternalServerError({
      cause: err,
    });
    console.log(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
