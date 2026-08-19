import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "../components/ui/Toast";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "Smart Team Workload Management",
  description: "Real-time client-side team capacity, risk escalation, and workload balancing dashboard.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
