// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Low-level Google Drive API Client
//  Handles PDF uploads and public link generation.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { google, type drive_v3 } from "googleapis";
import { Readable } from "stream";
import { getGoogleAuth } from "./auth";
import { withRetry } from "../helpers/retry";

export interface UploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink: string;
}

export class DriveClient {
  private api: drive_v3.Drive;
  private folderId: string;

  constructor(folderId?: string) {
    const id = folderId ?? process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!id) {
      throw new Error("Missing GOOGLE_DRIVE_FOLDER_ID environment variable.");
    }
    this.folderId = id;
    this.api = google.drive({ version: "v3", auth: getGoogleAuth() });
  }

  /**
   * Uploads a PDF buffer to Google Drive and makes it readable by anyone with the link.
   */
  async uploadPDF(
    fileName: string,
    pdfBuffer: Buffer,
  ): Promise<UploadResult> {
    return withRetry(async () => {
      // 1. Create the file
      const createRes = await this.api.files.create({
        requestBody: {
          name: fileName,
          mimeType: "application/pdf",
          parents: [this.folderId],
        },
        media: {
          mimeType: "application/pdf",
          body: Readable.from(pdfBuffer),
        },
        fields: "id,webViewLink,webContentLink",
      });

      const fileId = createRes.data.id;
      if (!fileId) throw new Error("Drive upload returned no file ID");

      // 2. Set public read permission
      await this.api.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      return {
        fileId,
        webViewLink: createRes.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`,
        webContentLink: createRes.data.webContentLink ?? `https://drive.google.com/uc?id=${fileId}&export=download`,
      };
    });
  }

  /** Deletes a file from Drive (for cleanup). */
  async deleteFile(fileId: string): Promise<void> {
    await withRetry(async () => {
      await this.api.files.delete({ fileId });
    });
  }

  /** Tests connectivity by listing files in the target folder. */
  async testConnection(): Promise<{ ok: boolean; fileCount?: number; error?: string }> {
    try {
      const res = await this.api.files.list({
        q: `'${this.folderId}' in parents and trashed = false`,
        pageSize: 1,
        fields: "files(id)",
      });
      return { ok: true, fileCount: res.data.files?.length ?? 0 };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
