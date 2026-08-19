import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "../components/ui/Toast";
import { ThemeProvider } from "../components/theme-provider";
import { SplashScreen } from "../components/layout/SplashScreen";

export const metadata: Metadata = {
  title: "Equinox - Intelligent Workload & Capacity Management",
  description: "Enterprise capacity balancing, dynamic priority aging, and resource expenditure orchestration.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
          <SplashScreen />
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
