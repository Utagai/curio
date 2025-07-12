import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Baloo_2, Nunito } from "next/font/google";
import NavBar from "./NavBar";

const baloo2Font = Baloo_2({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo2",
});

const nunitoFont = Nunito({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Curio",
  description: "Share IRL easter eggs",
  icons: {
    icon: "/logo.svg",
  },
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
          className={`${baloo2Font.variable} ${nunitoFont.variable} font-nunito bg-gray-900 text-white mx-32 my-4`}
        >
          <NavBar />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
