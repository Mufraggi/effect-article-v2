import { HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Effect, Schema } from "effect"
import { Api } from "../Api.js"

export class HealthGroup extends HttpApiGroup.make("health")
  .add(HttpApiEndpoint.post("get", "/").addSuccess(Schema.Struct({ "status": Schema.Literal("ok") })))
  .prefix("/health")
{}

export function getHealthGroupLive() {
  return HttpApiBuilder.group(Api, "health", (handlers) =>
    Effect.gen(function*() {
      yield* Effect.logDebug("HealthGroupLive")

      return handlers.handle("get", () => Effect.succeed({ status: "ok" }))
    }))
}
