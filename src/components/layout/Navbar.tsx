import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <span className="font-semibold text-lg hidden sm:inline">
            AgriWeather
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="hidden sm:inline">
            Dashboard Meteo per Agricoltori
          </span>
          <span className="sm:hidden">Meteo Agricolo</span>
        </div>
      </div>
    </nav>
  );
}
