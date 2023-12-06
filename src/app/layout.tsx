import type { Metadata } from "next";
import "./globals.css";
import { Pacifico } from "next/font/google";
import NavBar from "./navbar";

const pacificoFont = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pacificoFont.variable} bg-gray-900 text-white`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}