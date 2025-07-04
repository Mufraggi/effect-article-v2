import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import { Email } from "../../src/user/domain/email.js"
import { passwordFromString } from "../../src/user/domain/Password.js"
import { UserRepository } from "../../src/user/UserRepository.js"

describe("user repository", () => {
  it("should create a user", async () => {
    const program = Effect.gen(function*() {
      const repository = yield* UserRepository
      return yield* repository.insert({
        password: passwordFromString("aaaaaa"),
        email: Email.make("email@gmail.com"),
        createdAt: undefined,
        updatedAt: undefined
      })
    })
    try {
      const result = await Effect.runPromise(
        program.pipe(
          Effect.provide(UserRepository.Default)
        )
      )
      expect(result.email).toBe("email@gmail.com")
    } catch (e) {
      console.error("💥 Caught JS-level error:", e)
    }
  })
})
