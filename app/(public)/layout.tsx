import TopNav from "./TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <TopNav />
      </header>

      {children}
    </>
  );
}
