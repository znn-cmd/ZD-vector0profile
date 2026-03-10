// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Drive Service — PDF Upload + Report Metadata Persistence
//
//  Flow:
//    1. Create a "generating" report record in Sheets
//    2. Upload PDF to Google Drive
//    3. Update the report record with Drive URL → "ready"
//    4. On failure, update record → "failed" with error
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { DriveClient } from "./google/drive.client";
import type { ReportRepository } from "./interfaces";
import type { ReportRecord, CreateInput } from "./types";
import { nowISO } from "./helpers/id";

export interface UploadReportInput {
  sessionId: string;
  candidateId: string;
  templateId: string;
  fileName: string;
  pdfBuffer: Buffer;
}

export interface UploadReportResult {
  report: ReportRecord;
  driveUrl: string;
}

export class DriveService {
  private driveClient: DriveClient;
  private reportRepo: ReportRepository;

  constructor(reportRepo: ReportRepository, driveClient?: DriveClient) {
    this.reportRepo = reportRepo;
    this.driveClient = driveClient ?? new DriveClient();
  }

  /**
   * Full upload flow: creates report record, uploads PDF, updates metadata.
   * Handles partial failure: if upload fails, report record is marked "failed".
   */
  async uploadReport(input: UploadReportInput): Promise<UploadReportResult> {
    // Step 1: Create "generating" record
    const reportInput: CreateInput<ReportRecord> = {
      session_id: input.sessionId,
      candidate_id: input.candidateId,
      template_id: input.templateId,
      file_name: input.fileName,
      drive_file_id: "",
      drive_url: "",
      status: "generating",
      generated_at: "",
      error: "",
    };

    const report = await this.reportRepo.create(reportInput);

    try {
      // Step 2: Upload to Drive
      const result = await this.driveClient.uploadPDF(input.fileName, input.pdfBuffer);

      // Step 3: Update report with success metadata
      const updated = await this.reportRepo.update(report.id, {
        drive_file_id: result.fileId,
        drive_url: result.webViewLink,
        status: "ready",
        generated_at: nowISO(),
      });

      return { report: updated, driveUrl: result.webViewLink };
    } catch (err) {
      // Step 4: Mark failed with error details
      const errorMsg = err instanceof Error ? err.message : String(err);
      await this.reportRepo.update(report.id, {
        status: "failed",
        error: errorMsg,
      });

      throw new Error(`Report upload failed for session ${input.sessionId}: ${errorMsg}`);
    }
  }

  /** Re-attempts a failed report upload. */
  async retryFailedReport(reportId: string, pdfBuffer: Buffer): Promise<UploadReportResult> {
    const report = await this.reportRepo.findById(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);
    if (report.status !== "failed") throw new Error(`Report ${reportId} is not in "failed" state`);

    // Reset status
    await this.reportRepo.update(reportId, {
      status: "generating",
      error: "",
    });

    try {
      const result = await this.driveClient.uploadPDF(report.file_name, pdfBuffer);
      const updated = await this.reportRepo.update(reportId, {
        drive_file_id: result.fileId,
        drive_url: result.webViewLink,
        status: "ready",
        generated_at: nowISO(),
      });
      return { report: updated, driveUrl: result.webViewLink };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await this.reportRepo.update(reportId, {
        status: "failed",
        error: `Retry failed: ${errorMsg}`,
      });
      throw err;
    }
  }

  /** Tests Drive connectivity. */
  async testConnection(): Promise<{ ok: boolean; error?: string }> {
    return this.driveClient.testConnection();
  }
}
