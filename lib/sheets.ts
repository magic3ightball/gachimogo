import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { createPrivateKey } from "crypto";
import type { Participant, Appointment } from "./types";
export type { Participant, Appointment } from "./types";

const SHEET_NAME = "appointments";

function normalizePrivateKey(raw: string): string {
  // OpenSSL 3 (Node 17+) rejects PKCS#1 keys directly. Converting through
  // createPrivateKey → export as PKCS#8 makes it universally accepted.
  try {
    const keyObject = createPrivateKey({ key: raw, format: "pem" });
    return keyObject.export({ type: "pkcs8", format: "pem" }) as string;
  } catch {
    return raw; // already PKCS#8 or passthrough
  }
}

// Cached at module level — reuses auth token across requests
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "";
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: normalizePrivateKey(rawKey),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

function rowToAppointment(row: string[]): Appointment {
  return {
    id: row[0] ?? "",
    title: row[1] ?? "",
    host: row[2] ?? "",
    location: row[3] ?? "",
    datetime: row[4] ?? "",
    max_people: parseInt(row[5] ?? "2", 10),
    notes: row[6] ?? "",
    created_at: row[7] ?? "",
    participants: row[8] ? JSON.parse(row[8]) : [],
    host_email: row[9] ?? "",
    kakao_open_chat: row[10] ?? "",
  };
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A2:K`,
  });

  const rows = res.data.values ?? [];
  const appointments = rows
    .filter((row) => row[0]) // skip empty rows
    .map(rowToAppointment);

  // Sort by datetime, soonest first
  appointments.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  return appointments;
}

export async function getAppointmentById(
  id: string
): Promise<Appointment | null> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A2:K`,
  });
  const rows = res.data.values ?? [];
  const row = rows.find((r) => r[0] === id);
  return row ? rowToAppointment(row) : null;
}

export async function createAppointment(
  data: Omit<Appointment, "id" | "created_at" | "participants">
): Promise<Appointment> {
  const { v4: uuidv4 } = await import("uuid");
  const sheets = getSheetsClient();

  const newAppointment: Appointment = {
    id: uuidv4(),
    ...data,
    created_at: new Date().toISOString(),
    participants: [],
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A:K`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          newAppointment.id,
          newAppointment.title,
          newAppointment.host,
          newAppointment.location,
          newAppointment.datetime,
          newAppointment.max_people,
          newAppointment.notes,
          newAppointment.created_at,
          JSON.stringify(newAppointment.participants),
          newAppointment.host_email,
          newAppointment.kakao_open_chat,
        ],
      ],
    },
  });

  return newAppointment;
}

export async function addParticipant(
  id: string,
  nickname: string
): Promise<Appointment> {
  const sheets = getSheetsClient();

  // Get all rows to find the row index
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A:K`,
  });

  const rows = res.data.values ?? [];
  // row index 0 is the header
  const rowIndex = rows.findIndex((row) => row[0] === id);

  if (rowIndex === -1) {
    throw new Error(`Appointment ${id} not found`);
  }

  const appointment = rowToAppointment(rows[rowIndex]);

  if (appointment.participants.length >= appointment.max_people - 1) {
    throw new Error("Appointment is full");
  }

  const now = new Date();
  if (new Date(appointment.datetime) < now) {
    throw new Error("Appointment is in the past");
  }

  const nicknameLower = nickname.trim().toLowerCase();

  if (appointment.host.trim().toLowerCase() === nicknameLower) {
    throw new Error("호스트는 본인 약속에 참여할 수 없어요");
  }

  const alreadyJoined = appointment.participants.some(
    (p) => p.nickname.trim().toLowerCase() === nicknameLower
  );
  if (alreadyJoined) {
    throw new Error("You have already joined this appointment");
  }

  appointment.participants.push({
    nickname,
    joined_at: new Date().toISOString(),
  });

  // Sheet rows are 1-indexed, and row 1 is the header, so rowIndex maps directly
  const sheetRowNumber = rowIndex + 1;
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!I${sheetRowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[JSON.stringify(appointment.participants)]],
    },
  });

  return appointment;
}

