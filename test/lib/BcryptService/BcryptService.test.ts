import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import { BcryptService } from "../../../src/lib/BcryptService.js"
import { passwordStringFromString } from "../../../src/user/domain/Password.js"

// const unsafePasswordHash = (s: string) => s as PasswordHash

describe("BcryptService", () => {
  const passwordString = "myStrongPassword123"

  it("should hash a password", async () => {
    console.log("aaaa")
    const program = Effect.gen(function*() {
      const service = yield* BcryptService
      const password = yield* passwordStringFromString(passwordString)
      return yield* service.hashPassword(password)
    })
    console.log("aaaa")
    const result = await Effect.runPromiseExit(
      program.pipe(
        Effect.provide(BcryptService.Default)
      )
    )
    console.log(result)
    if (result._tag !== "Success") {
      expect(false).toBe(true)
    } else {
      expect(result.value).not.toBe(passwordString)
    }

    //  expect(typeof result).toBe("string")
  })

  /*it("should verify a valid password", async () => {
    const service = await Effect.runPromise(BcryptService)
    const hash = await runPromise(service.hashPassword(password))
    const isValid = await runPromise(service.verifyPassword(password, hash))

    expect(isValid).toBe(true)
  })

  it("should fail to verify an invalid password", async () => {
    const service = await Effect.runPromise(BcryptService)
    const hash = await runPromise(service.hashPassword(password))
    const wrongPassword = unsafeRawPassword("wrongPassword321")

    const result = await runPromise(
      service.verifyPassword(wrongPassword, hash).pipe(
        Effect.either
      )
    )

    expect(result._tag).toBe("Left")
    if (result._tag === "Left") {
      expect(result.left._tag).toBe("InvalidCredentialsError")
    }
  })*/
})
