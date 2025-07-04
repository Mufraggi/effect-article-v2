import { HttpApi, HttpApiBuilder } from "@effect/platform"

import { Layer } from "effect"
import { getHealthGroupLive, HealthGroup } from "./health/HttpApiGroup.js"

export class Api extends HttpApi.make("api")
  .add(HealthGroup)
{
}

export type ApiType = typeof Api
const api = Api
export const ApiLive = Layer.provide(HttpApiBuilder.api(api), [
  getHealthGroupLive()
])
