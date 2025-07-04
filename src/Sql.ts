import { PlatformConfigProvider } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { PgClient } from "@effect/sql-pg"
import { Config, Effect, identity, Layer, Redacted, String } from "effect"
import * as path from "node:path"

export const PgLive = Layer.unwrapEffect(
  Effect.gen(function*() {
    const database = yield* Config.string("DB_HOST")
    const username = yield* Config.string("DB_USER")
    const port = yield* Config.string("DB_PORT")
    const password = yield* Config.string("DB_PWD")
    const dbName = yield* Config.string("DB_NAME")
    const env = yield* Config.string("ENV")

    let url = `postgres://${username}:${password}@${database}:${port}/${dbName}`
    if (env === "production") {
      url += "?sslmode=require"
    }

    return PgClient.layer({
      url: Redacted.make(url),
      transformQueryNames: String.camelToSnake,
      transformResultNames: String.snakeToCamel,
      types: {
        114: { to: 25, from: [114], parse: identity, serialize: identity },
        1082: { to: 25, from: [1082], parse: identity, serialize: identity },
        1114: { to: 25, from: [1114], parse: identity, serialize: identity },
        1184: { to: 25, from: [1184], parse: identity, serialize: identity },
        3802: { to: 25, from: [3802], parse: identity, serialize: identity }
      }
    })
  })
).pipe(
  Layer.provide(PlatformConfigProvider.layerDotEnv(path.join(process.cwd(), ".env"))),
  Layer.provide(NodeContext.layer)
)
