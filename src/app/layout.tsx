import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import ClientBody from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S. K. Equipments",
  description:
    "S. K. Equipments – Established in 1998, we specialize in manufacturing and supplying high-quality testing equipment for leather, yarn, paper, dyeing, packaging, and more. Based in Noida, we are known for our innovation, reliability, and customer satisfaction across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/assets/images/logo/favicon.ico" sizes="any" />
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/assets/images/logo/sklogo.png" />
        {/* You can add meta tags or fonts here if needed */}
      </head>
      <body className={inter.className}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
