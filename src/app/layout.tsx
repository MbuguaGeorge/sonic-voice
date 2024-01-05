import type { Metadata } from 'next'
import { Poppins } from "next/font/google";
import { Providers } from "./provider";

import './globals.css';

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Sonic Voice',
  description: 'AI Music Player',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
