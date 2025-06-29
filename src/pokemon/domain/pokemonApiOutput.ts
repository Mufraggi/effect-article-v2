import { Schema } from "effect"

export const Pokemon = Schema.Struct({
  id: Schema.Number,
  name: Schema.String
})

const pokemonList = Schema.Array(Pokemon)
export const PokemonList = Schema.Struct({ pokemons: pokemonList })

export type PokemonType = typeof Pokemon["Type"]
export type PokemonListType = typeof pokemonList["Type"]
