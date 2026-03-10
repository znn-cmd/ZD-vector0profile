import { google, type drive_v3 } from "googleapis";

let driveInstance: drive_v3.Drive | null = null;

export function getDrive(): drive_v3.Drive {
  if (driveInstance) return driveInstance;

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  driveInstance = google.drive({ version: "v3", auth });
  return driveInstance;
}

export async function uploadPDFToDrive(
  fileName: string,
  pdfBuffer: Buffer
): Promise<string> {
  const drive = getDrive();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: "application/pdf",
      parents: folderId ? [folderId] : undefined,
    },
    media: {
      mimeType: "application/pdf",
      body: require("stream").Readable.from(pdfBuffer),
    },
    fields: "id, webViewLink",
  });

  // Make the file accessible via link
  if (res.data.id) {
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  }

  return res.data.webViewLink ?? `https://drive.google.com/file/d/${res.data.id}/view`;
}

export async function testDriveConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const drive = getDrive();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) return { ok: false, message: "GOOGLE_DRIVE_FOLDER_ID not set" };

    const res = await drive.files.get({ fileId: folderId, fields: "name" });
    return { ok: true, message: `Connected to folder "${res.data.name}"` };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
