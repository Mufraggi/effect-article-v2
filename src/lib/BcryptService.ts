import { HttpApiSchema } from "@effect/platform"
import * as bcrypt from "bcrypt"
import { Effect, Schema } from "effect"
import type { Password } from "../user/domain/Password.js"
import { passwordFromString } from "../user/domain/Password.js"

export class InvalidCredentialsError extends Schema.TaggedError<InvalidCredentialsError>()(
  "InvalidCredentialsError",
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 401 })
) {}

export class PasswordValidationError extends Schema.TaggedError<PasswordValidationError>()(
  "PasswordValidationError",
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 400 })
) {}

export class PasswordSystemError extends Schema.TaggedError<PasswordSystemError>()(
  "PasswordSystemError",
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 500 })
) {}

export class BcryptService extends Effect.Service<BcryptService>()("BcryptService", {
  effect: Effect.gen(function*() {
    yield* Effect.logDebug("PokemonGroupLive in memory")
    return {
      hashPassword: (password: Password) =>
        Effect.tryPromise({
          try: async () => {
            const hash = await bcrypt.hash(password.pipe(toString), 12)
            return passwordFromString(hash)
          },
          catch: (error) => new PasswordSystemError({ message: `Failed to hash password: ${error}` })
        }),
      verifyPassword: (password: Password, hash: Password) =>
        Effect.tryPromise({
          try: () => bcrypt.compare(password.pipe(toString), hash.pipe(toString)),
          catch: (error) => new PasswordSystemError({ message: `Failed to verify password: ${error}` })
        }).pipe(
          Effect.flatMap((isValid) =>
            isValid
              ? Effect.succeed(true)
              : Effect.fail(new InvalidCredentialsError({ message: "Invalid password" }))
          )
        )
    }
  })
}) {
}
