export default function CreateProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <body className="mt-4 min-h-svh w-full space-y-2">{children}</body>;
}
