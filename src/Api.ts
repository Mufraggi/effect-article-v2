import { HttpApi, HttpApiBuilder } from "@effect/platform"

import { Layer } from "effect"
import { getHealthGroupLive, HealthGroup } from "./health/HttpApiGroup.js"
import { HttpApiGroupReport, HttpApiGroupReportLive } from "./report/HttpGroup.js"
import { HttpApiGroupUser, HttpApiGroupUserLive } from "./user/UserController.js"

export class Api extends HttpApi.make("api")
  .add(HealthGroup)
    //.add(HttpApiGroupUser)
    .add(HttpApiGroupReport)
{
}

export type ApiType = typeof Api
const api = Api
export const ApiLive = Layer.provide(HttpApiBuilder.api(api), [
  getHealthGroupLive(),
 // HttpApiGroupUserLive(api),
  HttpApiGroupReportLive(api)
])
