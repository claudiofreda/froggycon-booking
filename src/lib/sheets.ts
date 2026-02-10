import { GoogleSheetsScope, SheetRange } from "@/types";
import config from "@/utils/config";
import { google } from "googleapis";

export const getAuth = (scopes: GoogleSheetsScope[]) =>
  new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: config.googleProjectId,
      private_key_id: config.googlePrivateKeyId,
      private_key: config.googlePrivateKey?.replace(/\\n/g, "\n"),
      client_email: config.googleClientEmail,
      client_id: config.googleClientId,
    },
    scopes,
  });

export async function getSheetData({
  spreadsheetId,
  range,
}: {
  spreadsheetId: string;
  range: SheetRange;
}) {
  const auth = getAuth([
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ]);

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error loading data from Google Sheets:", error);
    return [];
  }
}

export async function appendDataToSheet({
  spreadsheetId,
  range,
  data,
}: {
  spreadsheetId: string;
  range: SheetRange;
  data: unknown[];
}) {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, ...data]],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving data:", error);
    return [];
  }
}

async function getSheetIdByName({
  spreadsheetId,
  sheetName,
}: {
  spreadsheetId: string;
  sheetName: string;
}) {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const sheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = sheetMetadata.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    );

    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Foglio con nome '${sheetName}' non trovato.`);
    }

    return sheet.properties.sheetId;
  } catch (error) {
    console.error("Error getting sheetId:", error);
    return null;
  }
}

async function getRowIndexById({
  data,
  id,
  idColumnIndex = 1,
}: {
  data: unknown[][];
  id: string;
  idColumnIndex?: number;
}) {
  return data.findIndex((row) => row[idColumnIndex] === id);
}

export async function updateRowById({
  spreadsheetId,
  range,
  id,
  newData,
  idColumnIndex = 1,
}: {
  spreadsheetId: string;
  range: SheetRange;
  id: string;
  newData: unknown[];
  idColumnIndex?: number;
}) {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  const sheets = google.sheets({ version: "v4", auth });
  const sheetName = range.split("!")[0];

  try {
    const data = await getSheetData({ spreadsheetId, range });
    const rowIndex = await getRowIndexById({ data, id, idColumnIndex });

    if (rowIndex === -1) {
      console.error("ID not found");
      return null;
    }
    const currentRow = data[rowIndex];
    const updatedData = newData.map((value, index) =>
      value !== null ? value : currentRow[index]
    );

    const timestamp = new Date().toISOString();

    const updateRequest = {
      spreadsheetId,
      range: `${sheetName}!A${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, ...updatedData]],
      },
    };

    const response = await sheets.spreadsheets.values.update(updateRequest);

    return response.data;
  } catch (error) {
    console.error("Error updating row:", error);
    return null;
  }
}

export async function deleteRowById({
  spreadsheetId,
  range,
  id,
  idColumnIndex = 1,
}: {
  spreadsheetId: string;
  range: SheetRange;
  id: string;
  idColumnIndex?: number;
}) {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  const sheets = google.sheets({ version: "v4", auth });
  const sheetName = range.split("!")[0];

  try {
    const sheetId = await getSheetIdByName({ spreadsheetId, sheetName });
    if (!sheetId) return null;

    const data = await getSheetData({ spreadsheetId, range });
    const rowIndex = await getRowIndexById({ data, id, idColumnIndex });

    if (rowIndex === -1) {
      console.error("ID not found");
      return null;
    }

    const deleteRequest = {
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    };

    const response = await sheets.spreadsheets.batchUpdate(deleteRequest);

    return response.data;
  } catch (error) {
    console.error("Error deleting row:", error);
    return null;
  }
}
