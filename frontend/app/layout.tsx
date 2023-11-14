import Link  from "next/link";
import "./globals.css";

interface iRootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: iRootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex flex-row h-screen">
        {children}
      </body>
    </html>
  );
}
