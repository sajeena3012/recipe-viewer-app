import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Recipe Viewer",
  description: "Discover & save your favorite recipes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#fff7f0]">
        {/* Header */}
        <header className="bg-orange-600 text-white shadow-md p-6">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold">Recipe Viewer</h1>
              <p className="text-sm text-orange-100">Discover & save your favorite recipes</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-lg font-semibold px-4 py-2 hover:bg-orange-700 rounded transition"
              >
                🍲 Home
              </Link>
              <Link
                href="/favorites"
                className="text-lg font-semibold px-4 py-2 hover:bg-orange-700 rounded transition"
              >
                ❤️ Favorites
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 mt-6">{children}</main>
      </body>
    </html>
  );
}