import { Effect, Fiber, Match, Stream } from "effect"

import { ReportEventPubSub, ReportEventPubSubLayer } from "./domain/Event.js"
import type { ReportId } from "./domain/LicenceModel.js"

export class ReportGenerator extends Effect.Service<ReportGenerator>()("ReportGenerator", {
  effect: Effect.gen(function*() {
    const pubsub = yield* ReportEventPubSub
    yield* Effect.logInfo(`it is run ??`)
    const processEvents = Stream.fromPubSub(pubsub).pipe(
      Stream.runForEach((event) =>
        Effect.gen(function*() {
          yield* Effect.logInfo(`Processing event: ${event._tag} for ${event.id}`)
          yield* Match.value(event).pipe(
            Match.when(
              { _tag: "ReportCandies" },
              ({ id }) => generateCandiesReport(id)
            ),
            Match.when(
              { _tag: "ReportChocolate" },
              ({ id }) => generateCholoateReport(id)
            ),
            Match.orElse(() => Effect.logError(`tag not managed`))
          )
        }).pipe(
          // Gérer les erreurs pour qu'une défaillance ne stoppe pas le stream
          Effect.catchAll((error) => Effect.logError(`Report generato failed for event ${event._tag}`, error))
        )
      )
    )

    return {
      start: () =>
        Effect.gen(function*() {
          yield* Effect.logInfo("Starting ReportGenerator...")

          const fiber = yield* Effect.fork(processEvents)

          yield* Effect.logInfo("ReportGenerator started successfully")
          return fiber
        }),

      // Méthode pour arrêter le projector
      stop: (fiber: Fiber.Fiber<void, never>) =>
        Effect.gen(function*() {
          yield* Effect.logInfo("Stopping ReportGenerator...")
          yield* Fiber.interrupt(fiber)
          yield* Effect.logInfo("ReportGenerator stopped")
        })
    }
  }),
  dependencies: [ReportEventPubSubLayer]
}) {}

const generateCandiesReport = (id: ReportId) =>
  Effect.gen(function*() {
    yield* Effect.sleep("3 seconds")
    yield* Effect.logInfo(`make a report for candies  for ${id}`)
    // Exemple: yield* Database.update(...)
  })

const generateCholoateReport = (id: ReportId) =>
  Effect.gen(function*() {
    yield* Effect.sleep("3 seconds")
    yield* Effect.logInfo(`make a report for chocolates  for ${id}`)
  })
