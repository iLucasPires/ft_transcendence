import AsideBar from "@/app/components/AsideBar";

interface iRootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: iRootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex flex-row h-screen">
        <AsideBar />
        <div className="w-full h-full">{children}</div>
      </body>
    </html>
  );
}
