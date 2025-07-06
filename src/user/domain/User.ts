import { HttpApiSchema } from "@effect/platform"
import { Model } from "@effect/sql"
import { Context, Schema } from "effect"
import { Email } from "./email.js"
import { PasswordHash } from "./Password.js"

export const UserId = Schema.UUID.pipe(Schema.brand("UserId"))
export type UserId = typeof UserId.Type
export class User extends Model.Class<User>("User")({
  id: Model.Generated(UserId),
  email: Email,
  password: Model.Sensitive(PasswordHash),
  createdAt: Model.DateTimeInsert,
  updatedAt: Model.DateTimeUpdate
}) {}

export class UserWithSensitive extends Model.Class<UserWithSensitive>(
  "UserWithSensitive"
)({
  ...Model.fields(User),
  password: PasswordHash
}) {}

export class CurrentUser extends Context.Tag("Domain/User/CurrentUser")<
  CurrentUser,
  User
>() {}

export class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  { id: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {}

export class EmailNotFound extends Schema.TaggedError<EmailNotFound>()(
  "UserNotFound",
  { email: Email },
  HttpApiSchema.annotations({ status: 404 })
) {}

export class EmailAlreadyUsed extends Schema.TaggedError<EmailAlreadyUsed>()(
  "UserNotFound",
  { email: Email },
  HttpApiSchema.annotations({ status: 400 })
) {}
