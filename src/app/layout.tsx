import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Pacifico, Libre_Caslon_Text } from "next/font/google";
import NavBar from "./NavBar";

const pacificoFont = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});

const libreCaslonTextFont = Libre_Caslon_Text({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-librecaslon",
});

export const metadata: Metadata = {
  title: "Curio",
  description: "Share IRL easter eggs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={`${pacificoFont.variable} ${libreCaslonTextFont.variable} bg-gray-900 text-white`}
        >
          <NavBar />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
