import { HttpApiSchema } from "@effect/platform"
import * as Schema from "effect/Schema"
import { Email } from "../email.js"
import { PasswordString } from "../Password.js"

export const SigningInput = Schema.Struct({ email: Email, password: PasswordString })

export const CreateUserRequest = Schema.Struct({
  email: Email,
  password: PasswordString,
  confirmPassword: PasswordString
}).pipe(
  Schema.filter((data) => {
    console.log("Password:", data.password, "Confirm:", data.confirmPassword)
    return data.password === data.confirmPassword
  }, {
    message: () => "Passwords do not match",
    jsonSchema: {
      type: "object",
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
        confirmPassword: { type: "string" }
      },
      required: ["email", "password", "confirmPassword"],
      description: "Ensure password and confirmPassword match"
    }
  })
)

export class PasswordMismatchError extends Schema.TaggedError<PasswordMismatchError>()(
  "PasswordMismatchError",
  { message: Schema.String },
  HttpApiSchema.annotations({ status: 400 })
) {}
