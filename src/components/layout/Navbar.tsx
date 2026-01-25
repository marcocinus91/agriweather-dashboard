import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-semibold text-lg">AgriWeather</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">Città salvate</span>
        </div>
      </div>
    </nav>
  );
}
