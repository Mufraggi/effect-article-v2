import { HttpApiSchema } from "@effect/platform"
import * as bcrypt from "bcrypt"
import { Effect, pipe, Schema } from "effect"
import type { PasswordHash, PasswordString } from "../user/domain/Password.js"
import { passwordHashFromString } from "../user/domain/Password.js"

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
      hashPassword: (password: PasswordString) =>
        pipe(
          Effect.tryPromise({
            try: async () => {
              return await bcrypt.hash(password, 12)
            },
            catch: (error) => new PasswordSystemError({ message: `Failed to hash password: ${error}` })
          }),
          Effect.flatMap(passwordHashFromString)
        ),
      verifyPassword: (password: PasswordString, hash: PasswordHash) =>
        Effect.tryPromise({
          try: () => bcrypt.compare(password, hash),
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
