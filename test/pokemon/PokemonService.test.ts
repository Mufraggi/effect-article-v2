import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import { PokemonService } from "../../src/pokemon/PokemonService.js"

describe("Pokemon Service", () => {
  it("should return a Pokemon by id", async () => {
    const program = Effect.gen(function*() {
      const service = yield* PokemonService
      return yield* service.getById(1)
    })
    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(PokemonService.Default)
      )
    )
    expect(result).toEqual({ id: 1, name: "Bulbasaur" })
  })
  it("should return all pokemons when listing", async () => {
    const program = Effect.gen(function*() {
      const service = yield* PokemonService
      return yield* service.list()
    })

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(PokemonService.Default)
      )
    )

    expect(result).toEqual({
      pokemons: [
        { id: 1, name: "Bulbasaur" },
        { id: 2, name: "Ivysaur" },
        { id: 3, name: "Mrs.Mime" }
      ]
    })
  })

  it("should handle not found error", async () => {
    const program = Effect.gen(function*() {
      const service = yield* PokemonService
      return yield* service.getById(999)
    })

    const result = await Effect.runPromiseExit(
      program.pipe(
        Effect.provide(PokemonService.Default)
      )
    )

    expect(Exit.isFailure(result)).toBe(true)
  })
})
