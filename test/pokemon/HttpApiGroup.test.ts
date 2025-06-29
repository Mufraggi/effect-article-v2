import { HttpApi } from "@effect/platform"
import { Api } from "@effect/platform/HttpApi"
import { describe, expect, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { makeTestLayer } from "src/lib/Layer.js"
import { HttpApiGroupPokemon, HttpApiGroupPokemonLive } from "src/pokemon/HttpApiGroup.js"
import type { HealthGroup } from "../../src/health/HttpApiGroup.js"
import { PokemonService } from "../../src/pokemon/PokemonService.js"

describe("HttpApiGroupPokemonLive", () => {
  it("returns a handler that responds with pikachu", async () => {
    const api = Api
    const handlersEffect = HttpApiGroupPokemonLive(api)

    const handlers = await Effect.runPromise(
      handlersEffect.pipe(
        Layer.provide(
          makeTestLayer(PokemonService)({
            getById: () => Effect.succeed({ id: 25, name: "Pikachu" }),
            list: () => Effect.succeed({ pokemons: [{ id: 25, name: "Pikachu" }] })
          })
        ),
        Effect.scoped
      )
    )

    const res = await Effect.runPromise(handlers.getById({ path: { id: 25 } }))
    expect(res).toEqual({ id: 25, name: "Pikachu" })
  })
})
