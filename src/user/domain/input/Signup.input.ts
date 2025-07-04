import { HttpApiSchema } from "@effect/platform"
import * as Schema from "effect/Schema"
import { Email } from "../email.js"
import { Password } from "../Password.js"

export const CreateUserRequest = Schema.Struct({
  email: Email,
  password: Password,
  confirmPassword: Password
}).pipe(
  Schema.filter((data) => data.password === data.confirmPassword, {
    message: () => "Passwords do not match"
  })
)

export class PasswordMismatchError extends Schema.TaggedError<PasswordMismatchError>()(
  "PasswordMismatchError",
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 400 })
) {}
