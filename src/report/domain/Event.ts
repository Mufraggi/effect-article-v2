import { Context, Layer, PubSub } from "effect"
import type { ReportId } from "./LicenceModel.js"

export type ReportEvent =
  | { readonly _tag: "ReportCandies"; readonly id: ReportId }
  | { readonly _tag: "ReportChocolate"; readonly id: ReportId }

export const ReportEventPubSub = Context.GenericTag<PubSub.PubSub<ReportEvent>>("ReportEventPubSub")

export const ReportEventPubSubLayer = Layer.scoped(
  ReportEventPubSub,
  PubSub.unbounded<ReportEvent>()
)
