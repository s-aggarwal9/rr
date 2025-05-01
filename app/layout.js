import "./globals.css";
import { Inter } from "next/font/google";
import ClientProvider from "@/components/ClientProvider"; // ✅ Import it here

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App",
  description: "Signal/WhatsApp clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
