export default function LoginPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="flex min-h-svh flex-col justify-center gap-4">
      {children}
    </body>
  );
}
