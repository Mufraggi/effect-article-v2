import { HttpApiBuilder, HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { Effect, Layer, Schema } from "effect"

import type { ApiType } from "src/Api.js"
import { InvalidCredentialsError, PasswordSystemError } from "../lib/BcryptService.js"
import { CreateUserRequest, SigningInput } from "./domain/input/Signup.input.js"
import { EmailAlreadyUsed, EmailNotFound, UserId } from "./domain/User.js"
import { UserService } from "./UserService.js"

export class HttpApiGroupUser extends HttpApiGroup.make("@Group/User")
  .add(
    HttpApiEndpoint.post("create", "/sign-up")
      .setPayload(CreateUserRequest)
      .addSuccess(Schema.Struct({ id: UserId }))
      .addError(
        HttpApiError.InternalServerError
      ).addError(EmailAlreadyUsed).addError(PasswordSystemError)
  ).add(
    HttpApiEndpoint.post("login", "/sign-in")
      .setPayload(SigningInput)
      .addSuccess(Schema.Struct({ id: UserId }))
      .addError(EmailNotFound)
      .addError(PasswordSystemError)
      .addError(InvalidCredentialsError)
      .addError(HttpApiDecodeError)
  )
  .prefix("/user")
{
}

export const HttpApiGroupUserLive = (api: ApiType) =>
  HttpApiBuilder.group(
    api,
    "@Group/User",
    (handlers) =>
      Effect.gen(function*() {
        const service = yield* UserService
        return handlers
          .handle(
            "create",
            ({ payload }) =>
              service.signup(payload.email, payload.password).pipe(
                Effect.map((id) => ({ id }))
              )
          )
          .handle("login", ({ payload }) =>
            service.login(payload.email, payload.password).pipe(
              Effect.flatMap((id) => Effect.succeed({ id }))
            ))
      })
  ).pipe(Layer.provide([UserService.Default]))
