import { Redacted, Schema } from "effect"

export const PasswordString = Schema.String.pipe(Schema.brand("Password"))

export const Password = Schema.Redacted(PasswordString)

export type Password = typeof Password.Type

export const passwordFromString = (pwd: string): Password =>
    Redacted.make(PasswordString.make(pwd))

export const passwordFromRedacted = (
    pwd: Redacted.Redacted
): Password => pwd as Password
