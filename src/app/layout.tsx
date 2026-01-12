import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prime Engine | AI-Native App Builder",
  description: "Build full-stack web applications with absolute power using Prime Engine AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-solar-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
