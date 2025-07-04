import { HttpApiError } from "@effect/platform"
import { Effect } from "effect"
import type { PokemonListType } from "./domain/pokemonApiOutput.js"

export class PokemonService extends Effect.Service<PokemonService>()("PokemonService", {
  effect: Effect.gen(function*() {
    yield* Effect.logDebug("PokemonGroupLive in memory")

    const mockData: PokemonListType = [
      { id: 1, name: "Bulbasaur" },
      { id: 2, name: "Ivysaur" },
      { id: 3, name: "Mrs.Mime" }
    ]
    return {
      getById: (id: number) =>
        Effect.try({
          try: () => {
            const found = mockData.find((p) => p.id === id)
            if (!found) {
              throw new HttpApiError.NotFound()
            }
            return found
          },
          catch: (_e) => new HttpApiError.NotFound()
        }),
      list: () =>
        Effect.try({
          try: () => ({
            pokemons: mockData
          }),
          catch: () => {
            throw new HttpApiError.InternalServerError()
          }
        })
    }
  })
}) {
  static InMemory = {
    effect: Effect.gen(function*() {
      yield* Effect.logDebug("PokemonGroupLive in memory")

      const mockData: PokemonListType = [
        { id: 1, name: "Bulbasaur" },
        { id: 2, name: "Ivysaur" },
        { id: 3, name: "Mrs.Mime" }
      ]
      return {
        getById: (id: number) =>
          Effect.try({
            try: () => {
              const found = mockData.find((p) => p.id === id)
              if (!found) {
                throw new HttpApiError.NotFound()
              }
              return found
            },
            catch: (_e) => new HttpApiError.NotFound()
          }),
        list: () =>
          Effect.try({
            try: () => ({
              pokemons: mockData
            }),
            catch: () => {
              throw new HttpApiError.InternalServerError()
            }
          })
      }
    })
  }
}
