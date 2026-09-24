import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "mediSure | Scan. Trace. Trust.",
  description: "Pharmacy medicine tracking and supply-chain verification platform.",
  manifest: "/manifest.json",
  themeColor: "#00A878",
  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
