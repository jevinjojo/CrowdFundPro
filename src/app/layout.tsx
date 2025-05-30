import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import NavBar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrowdFundPro | Blockchain Crowdfunding Platform",
  description:
    "A decentralized crowdfunding platform powered by blockchain technology",
  icons: [
    {
      rel: "icon",
      url: "/new-favicon.svg",
      type: "image/svg+xml",
    },
    {
      rel: "apple-touch-icon",
      url: "/new-favicon.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-700">
        <ThirdwebProvider>
          
          <NavBar/>
          {children} 

        </ThirdwebProvider>
      </body>
    </html>
  );
}
