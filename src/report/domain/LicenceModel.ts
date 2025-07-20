import { Schema } from "effect"

export const ReportId = Schema.UUID.pipe(Schema.brand("ReportId"))
export type ReportId = typeof ReportId.Type
