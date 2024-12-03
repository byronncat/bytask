export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-red-500 w-screen h-screen">
      <main>{children}</main>
    </div>
  );
}
