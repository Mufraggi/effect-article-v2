import { SqlClient } from "@effect/sql"
import { Effect, Option, pipe } from "effect"
import { BcryptService, InvalidCredentialsError } from "../lib/BcryptService.js"
import { PgLive } from "../Sql.js"
import type { Email } from "./domain/email.js"
import type { PasswordString } from "./domain/Password.js"
import type { User } from "./domain/User.js"
import { EmailAlreadyUsed, EmailNotFound } from "./domain/User.js"
import { UserRepository } from "./UserRepository.js"

export class UserService extends Effect.Service<UserService>()("UserService", {
  effect: Effect.gen(function*() {
    const userRepository = yield* UserRepository
    const bcryptService = yield* BcryptService
    const sql = yield* SqlClient.SqlClient
    return {
      signup: (email: Email, password: PasswordString) =>
        userRepository.findByEmail(email).pipe(
          Effect.flatMap(
            Option.match({
              onNone: () => Effect.succeed(undefined),
              onSome: (_) => Effect.fail(new EmailAlreadyUsed({ email }))
            })
          ),
          Effect.andThen(() => bcryptService.hashPassword(password)),
          Effect.flatMap((hash) =>
            userRepository.insert({
              password: hash,
              email,
              createdAt: undefined,
              updatedAt: undefined
            })
          ),
          Effect.flatMap((user) => Effect.succeed(user.id)),
          sql.withTransaction,
          Effect.catchTag("SqlError", (err) => Effect.die(err)),
          Effect.catchTag("ParseError", (err) => Effect.die(err))
        ),
      login: (email: Email, password: PasswordString) =>
        userRepository.findByEmail(email).pipe(
          Effect.flatMap(Option.match({
            onNone: () => Effect.fail(new EmailNotFound({ email })),
            onSome: (user: User) => Effect.succeed(user)
          })),
          Effect.flatMap((user) =>
            pipe(
              bcryptService.verifyPassword(password, user.password),
              Effect.flatMap((isGoodPassword) =>
                isGoodPassword
                  ? Effect.succeed(user)
                  : Effect.fail(new InvalidCredentialsError({ message: "Invalid password" }))
              )
            )
          ),
          Effect.flatMap((user) => Effect.succeed(user.id)),
          sql.withTransaction,
          Effect.catchTag("SqlError", (err) => Effect.die(err))
        )
    }
  }),
  dependencies: [UserRepository.Default, BcryptService.Default, PgLive]
}) {
}
