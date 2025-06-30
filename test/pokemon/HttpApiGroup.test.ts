import { HttpApi, HttpApiBuilder, HttpApiClient  } from "@effect/platform"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

import { describe, expect, it } from "vitest"
import { HttpClient } from "@effect/platformnode"

import { HttpApiGroupPokemon, HttpApiGroupPokemonLive } from "../../src/pokemon/HttpApiGroup.js"
import { PokemonService } from "../../src/pokemon/PokemonService.js"

class ApiTest extends HttpApi.make("api")
  .add(HttpApiGroupPokemon)
{
}

const createTestApi = () => {
  const api = ApiTest
  const testLayer = Layer.mergeAll(
    HttpApiBuilder.api(api),
    HttpApiGroupPokemonLive(api),
    PokemonService.Default,
  )
  return { api, testLayer }
}

describe("HttpApiGroupPokemon", () => {
  describe("Structure du groupe", () => {
    it("devrait avoir le bon nom de groupe", () => {
      const group = HttpApiGroupPokemon
      expect(group.identifier).toBe("pokemon")
    })

    it("devrait avoir les bons endpoints", () => {
      const group = HttpApiGroupPokemon
      const endpoints = group.endpoints
      expect(endpoints["getById"].path).toBe("/pokemon/:id")
      expect(endpoints["getAll"].path).toBe("/pokemon")
    })
  })

  it("devrait retourner un pokemon existant", async () => {
    const { api, testLayer } = createTestApi()

    const program = Effect.gen(function*() {
      const client = yield* HttpApiClient.make(api, {
        baseUrl: "http://localhost"
      })

      return yield* client.pokemon.getById({ path: { id: 1 } })
    })

    // Option 1: Utiliser runPromiseExit pour capturer les erreurs
    const result = await Effect.runPromiseExit(
      Effect.provide(program, testLayer)
    )

    if (result._tag === "Failure") {
      console.error("Erreur capturée:", result.cause)
      throw new Error(`Test failed: ${JSON.stringify(result.cause)}`)
    }

    expect(result.value).toEqual({ id: 1, name: "Bulbasaur" })
  })
})
