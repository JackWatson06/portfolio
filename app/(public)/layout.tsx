import TopNav from "./TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TopNav />

      {children}
    </div>
  );
}
