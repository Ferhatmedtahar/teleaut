import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";

import localFont from "next/font/local";
import "../styles/globals.css";

const sfUiText = localFont({
  src: [
    {
      path: "../fonts/SFUIText-Heavy.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/SFUIText-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/SFUIText-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/SFUIText-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/SFUIText-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SFUIText-Light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--sf-ui-text",
});

export const metadata: Metadata = {
  title: "Teleaustism",
  description: "Teleaustism - Plateforme de soutien pour l'autisme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sfUiText.variable} ${sfUiText.variable}  antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
          <Toaster richColors expand={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
