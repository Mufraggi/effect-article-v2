import { Schema } from "effect"
import type { Brand } from "effect/Brand"

export type PasswordString = string & Brand<"PasswordString">

// Règle de validation :
// - Au moins 8 caractères
// - Au moins une majuscule
// - Au moins une minuscule
// - Au moins un chiffre
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export type PasswordHash = string & Brand<"PasswordHash">

export const PasswordString = Schema.String.pipe(
  Schema.pattern(passwordRegex),
  Schema.annotations({
    title: "Password",
    description: "Doit contenir au moins 8 caractères, avec une majuscule, une minuscule et un chiffre"
  }),
  Schema.brand("PasswordString")
)

export const passwordStringFromString = (
  hash: string
) => Schema.decode(PasswordString)(hash)

// Schéma pour valider que c'est une string hashée
export const PasswordHash = Schema.String.pipe(
  Schema.minLength(60), // bcrypt hashes are typically 60 characters
  Schema.maxLength(60),
  Schema.pattern(/^\$2[aby]\$.{56}$/), // pattern for bcrypt hashes
  Schema.brand("PasswordHash"),
  Schema.annotations({
    title: "PasswordHash",
    description: "Mot de passe haché avec bcrypt"
  })
)
export const passwordHashFromString = (
  hash: string
) => Schema.decode(PasswordHash)(hash)
