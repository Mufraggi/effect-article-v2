import { HttpApiBuilder, HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import * as Effect from "effect/Effect"
import type { ApiType } from "../Api.js"
import { Pokemon, PokemonList } from "./domain/pokemonApiOutput.js"
import { PokemonService } from "./PokemonService.js"

export class HttpApiGroupPokemon extends HttpApiGroup.make("pokemon")
  .add(
    HttpApiEndpoint.get("getById", "/:id")
      .setPath(Schema.Struct({ id: Schema.NumberFromString }))
      .addSuccess(Pokemon).addError(HttpApiError.NotFound)
  )
  .add(HttpApiEndpoint.get("getAll", "/").addSuccess(PokemonList).addError(HttpApiError.InternalServerError))
  .prefix("/pokemon")
{
}

export const HttpApiGroupPokemonLive = (api: ApiType) =>
  HttpApiBuilder.group(
    api,
    "pokemon",
    (handlers) =>
      Effect.gen(function*() {
        yield* Effect.logDebug("PokemonGroupLive in memory")
        const pokemonService = yield* PokemonService
        return handlers
          .handle("getById", ({ path }) => pokemonService.getById(path.id))
          .handle("getAll", (_) => pokemonService.list())
      })
  )
