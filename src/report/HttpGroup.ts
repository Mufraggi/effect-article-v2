import { HttpApiBuilder, HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { Effect, Layer, Schema } from "effect"
import type { ApiType } from "src/Api.js"
import { ReportId } from "./domain/LicenceModel.js"
import { ReportService } from "./Service.js"

export class HttpApiGroupReport extends HttpApiGroup.make("@Group/report")
  .add(
    HttpApiEndpoint.post("generateRepot", "/:id/generate")
      .setPath(Schema.Struct({ id: ReportId }))
      .addSuccess(Schema.Struct({ id: ReportId }))
      .addError(HttpApiError.InternalServerError)
  )
  .prefix("/report")
{}

export const HttpApiGroupReportLive = (api: ApiType) =>
  HttpApiBuilder.group(api, "@Group/report", (handlers) =>
    Effect.gen(function*() {
      const service = yield* ReportService

      return handlers
        .handle("generateRepot", (req) => service.generateReport(req.path.id))
    })).pipe(Layer.provide([ReportService.Default]))
