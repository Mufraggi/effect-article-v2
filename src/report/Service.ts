import { Effect, pipe } from "effect"
import { ReportEventPubSub, ReportEventPubSubLayer } from "./domain/Event.js"
import type { ReportId } from "./domain/LicenceModel.js"

export class ReportService extends Effect.Service<ReportService>()("ReportService", {
  effect: Effect.gen(function*() {
    yield* Effect.log("report Service")
    const pubsub = yield* ReportEventPubSub

    return {
      generateReport: (id: ReportId) =>
        pipe(
          Effect.succeed("Start generation"),
          Effect.flatMap(() =>
            pipe(
              Effect.logInfo(`insert in db ${id}`),
              Effect.andThen(Effect.sleep("1 seconds")),
              Effect.andThen(Effect.logInfo("insert done in db"))
            )
          ),
          Effect.andThen(() => pubsub.publish({ _tag: "ReportCandies", id })),
          Effect.andThen(() => Effect.succeed({ id }))
        )
    }
  }),
  dependencies: [ReportEventPubSubLayer]
}) {}
