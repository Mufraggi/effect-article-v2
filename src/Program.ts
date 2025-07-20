import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"

import { createServer } from "node:http"
import { ApiLive } from "./Api.js"
import { ReportGenerator } from "./report/ReportGenerator.js"

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, {
    port: 3000
  }))
)

const MainEffect = Effect.gen(function*() {
  const projector = yield* ReportGenerator
  yield* projector.start()
  yield* Effect.logInfo("All services started")
  yield* Effect.never
})

const MainLayer = Layer.mergeAll(
  ReportGenerator.Default,
  HttpLive
)

MainEffect.pipe(
  Effect.provide(MainLayer),
  NodeRuntime.runMain
)
