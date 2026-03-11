import type { Metadata } from "next";
import { Inter, Oswald, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Cinema Bill",
  description: "Minimalist utility for cinephiles. Converts your recent watches into a high-fidelity thermal receipt visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} ${vt323.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
