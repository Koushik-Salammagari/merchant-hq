import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebMcpProvider from "@/components/WebMcpProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Merchant HQ",
  description: "An agent co-pilot for your store's back office, built with WebMCP.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WebMcpProvider>{children}</WebMcpProvider>
      </body>
    </html>
  );
}
