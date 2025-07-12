import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
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
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <html lang="en">
          <body
            className={`${baloo2Font.variable} ${nunitoFont.variable} font-nunito bg-gray-900 text-white mx-32 my-4`}
          >
            <NavBar />
            {children}
          </body>
        </html>
      </SignedIn>
    </ClerkProvider>
  );
}
