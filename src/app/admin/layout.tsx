import config from "@/utils/config";
import { AuthProvider } from "@propelauth/nextjs/client";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider authUrl={config.propelAuthUrl!}>{children}</AuthProvider>
  );
}
