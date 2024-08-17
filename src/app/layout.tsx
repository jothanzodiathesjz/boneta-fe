

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

import 'leaflet/dist/leaflet.css';
import { PrimeReactProvider } from 'primereact/api';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boneta Restarant App",
  description: "Boneta Restarant App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
        <PrimeReactProvider>
            <body className={inter.className}>
              
              <main className="w-full flex justify-center overflow-x-hidden">
                {children}
              </main>
            </body>
        </PrimeReactProvider>
    </html>
  );
}
