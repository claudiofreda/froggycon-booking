import { SheetRange } from "@/types";

export default {
  baseUrl: process.env.BASE_URL,
  defaultLocale: "it",

  bookingsEnabled: process.env.NEXT_PUBLIC_BOOKINGS_ENABLED === "true",

  sessionsRange: process.env.SHEET_SESSION_RANGE as SheetRange,
  sessionsSheetId: process.env.SESSIONS_SHEET_ID as string,
  bookingsRange: process.env.SHEET_BOOKINGS_RANGE as SheetRange,
  bookingsSheetId: process.env.BOOKINGS_SHEET_ID as string,

  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
  googlePrivateKeyId: process.env.GOOGLE_PRIVATE_KEY_ID,
  googleProjectId: process.env.GOOGLE_PROJECT_ID,

  propelAuthUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
  propelApiKey: process.env.PROPELAUTH_API_KEY as string,
  propelVerifierKey: process.env.PROPELAUTH_VERIFIER_KEY as string,

  mailContact: process.env.MAIL_CONTACT || "",
  mailSender: process.env.MAIL_SENDER as string,
  resendApiKey: process.env.RESEND_API_KEY,
  resendEnabled: process.env.RESEND_ENABLED,
} as const;
