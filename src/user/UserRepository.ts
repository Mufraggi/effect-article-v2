import { Model, SqlClient, SqlSchema } from "@effect/sql"
import { Effect, pipe } from "effect"
import { makeTestLayer } from "../lib/Layer.js"
import { PgLive } from "../Sql.js"
import { Email } from "./domain/email.js"
import { User } from "./domain/User.js"

export class UserRepository extends Effect.Service<UserRepository>()("UserRepository", {
  effect: Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient
    const repo = yield* Model.makeRepository(User, {
      tableName: "users",
      spanPrefix: "UsersRepo",
      idColumn: "id"
    })
    const findByEmailSchema = SqlSchema.findOne({
      Request: Email,
      Result: User,
      execute: (key) => sql`select * from users where email = ${key}`
    })
    const findByEmail = (email: Email) =>
      pipe(
        findByEmailSchema(email),
        Effect.orDie,
        Effect.withSpan("UsersRepository.findByEmail")
      )
    return { ...repo, findByEmail }
  }),
  dependencies: [PgLive]
}) {
  static Test = makeTestLayer(UserRepository)({})
}
